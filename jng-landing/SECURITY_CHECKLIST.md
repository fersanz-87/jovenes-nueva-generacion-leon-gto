# Security Checklist — Pre-Launch Hardening

## Completado en este branch

| # | Tarea | Commit |
|---|-------|--------|
| 1 | CSP enforced (ya no Report-Only) + `Cross-Origin-Opener-Policy` + `Cross-Origin-Resource-Policy` | `feat: enforce CSP and add cross-origin isolation headers` |
| 2 | Rate limiter con Upstash Redis (sliding window) + fallback in-memory para dev | `feat: integrate Upstash Redis rate limiter with in-memory fallback` |
| 3 | Email de contacto via Resend (reemplaza stub `console.log`) | `feat: implement Resend email transport for contact form` |
| 4 | Cloudflare Turnstile (invisible widget + verificación server-side) | `feat: add Cloudflare Turnstile anti-bot verification` |
| 5 | CI workflow: `pnpm audit`, lint, tests en push/PR | `chore: add CI workflow for security audit, lint, and tests` |
| 6 | Fix `brace-expansion` override que rompia eslint | `fix: scope brace-expansion override by major to unblock eslint` |
| 7 | Bump Next.js 16.2.4 → 16.2.6, React 19.2.3 → 19.2.6 (12 CVEs high) | `fix(deps): bump next to 16.2.6 to patch 12 high-severity CVEs` |
| 8 | CSP dinámico con nonces per-request via proxy.ts (reemplaza CSP estático) | `fix(csp): replace static CSP with dynamic nonce-based policy in proxy` |

## Variables de entorno a configurar en Vercel

| Variable | Tipo | Requerida | Notas |
|----------|------|-----------|-------|
| `RESEND_API_KEY` | Secret | Si | Obtener en https://resend.com/api-keys |
| `RESEND_FROM` | Plain | Si | Formato: `JNG <noreply@tudominio.com>` — el dominio debe estar verificado en Resend |
| `EMAIL_TO` | Plain | Si | Email destino para formulario de contacto (ya deberia estar configurada) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Plain | Si | Obtener en Cloudflare Dashboard > Turnstile > Add Site (modo invisible) |
| `TURNSTILE_SECRET_KEY` | Secret | Si | Se genera junto con el site key |
| `UPSTASH_REDIS_REST_URL` | Secret | Si | Crear base de datos en https://console.upstash.com |
| `UPSTASH_REDIS_REST_TOKEN` | Secret | Si | Se genera con la base de datos |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Plain | Si | Ya existente |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Plain | Si | Ya existente |

## Checklist manual post-deploy

- [ ] Verificar headers de seguridad en https://securityheaders.com — debe dar A o A+
- [ ] Verificar CSP no rompe nada: navegar todas las secciones, abrir consola del navegador, buscar errores CSP
- [ ] Probar el formulario de contacto en produccion: enviar un mensaje real y verificar que llega al email destino
- [ ] Verificar logs de Resend en https://resend.com/emails — confirmar que el email se envio correctamente
- [ ] Probar Turnstile: enviar formulario y verificar en Cloudflare Dashboard > Turnstile > Analytics que se registran verificaciones
- [ ] Probar rate limiting: enviar 6+ solicitudes rapidas y verificar que se recibe error 429
- [ ] Verificar que el mapa de Google sigue cargando correctamente (frame-src)
- [ ] Verificar que las imagenes de Cloudinary cargan correctamente (img-src)
- [ ] Revisar que `pnpm audit` no tiene vulnerabilidades high/critical en el pipeline de CI

## Notas

- `style-src 'unsafe-inline'` se mantiene: CSP nonces solo cubren `<style>` tags, no atributos `style` en elementos. Cuando un nonce está presente, `'unsafe-inline'` es ignorado por spec, así que no se pueden combinar. El riesgo de CSS injection es mucho menor que XSS vía scripts.
- El rate limiter en Vercel corre en Edge/Serverless — sin Upstash Redis, cada instancia tendria su propio store in-memory (inefectivo). Upstash es necesario para rate limiting real en produccion.
- Si `TURNSTILE_SECRET_KEY` no esta configurada, la verificacion se omite (graceful degradation para dev/staging).
- Si `RESEND_API_KEY` no esta configurada, los emails se loguean en consola en vez de enviarse.
- Next.js y React deben revisarse mensualmente. Subscribirse a https://github.com/vercel/next.js/security/advisories para recibir alertas.
- Queda 1 advisory moderate: `postcss <8.5.10` (XSS en CSS stringify) — dep transitiva de `@tailwindcss/postcss` y `next`. Se resolvera cuando publiquen updates.

## Notas de arquitectura

### CSP con nonces requiere dynamic rendering

El proxy middleware genera un nonce por request e inyecta CSP estricto.
Toda nueva ruta del App Router que use inline scripts (RSC, framework JS, next/script)
debe optar por dynamic rendering vía `await connection()` desde `next/server`.

Rutas afectadas actualmente:
- `/` (src/app/page.tsx) — dynamic ✅

Si en el futuro se agrega una ruta nueva (ej. `/blog`, `/eventos`):
- Si la ruta NO tiene inline scripts: puede quedarse static, no requiere cambio
- Si la ruta tiene inline scripts o componentes client: agregar `await connection()`
  o experimentar errores CSP silenciosos en hidratación

### Pendiente para investigar pre-go-live (no de este branch)

Durante el debugging del CSP se detectó que `curl POST /api/contact` con
header `cf-turnstile-response: ""` (vacío) devuelve `success: true` cuando
`TURNSTILE_SECRET_KEY` no está set en el environment. Esto es el "graceful
degradation" implementado en commit #4.

Acción requerida antes del go-live: verificar que `TURNSTILE_SECRET_KEY`
SÍ está configurado en Vercel Production environment. Sin esa env, el
anti-bot del formulario queda inactivo.
