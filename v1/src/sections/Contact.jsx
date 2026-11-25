import { useEffect, useRef, useState } from 'react'
import { gsap } from '../utils/gsap'
import Figure from '../components/Figure'
import Reveal, { SplitLines } from '../components/Reveal'
import { BRAND, PROJECT_TYPES } from '../data/site'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useScrollTo } from '../hooks/useSmoothScroll'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Permissive on purpose: spaces, dashes, brackets and +country all pass.
const PHONE_RE = /^[+()\d][\d\s\-()]{7,17}$/

const FIELDS = {
  name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
  email: (v) => (!EMAIL_RE.test(v.trim()) ? 'Please enter an email we can reply to.' : ''),
  phone: (v) => (v.trim() && !PHONE_RE.test(v.trim()) ? 'That does not look like a phone number.' : ''),
  projectType: (v) => (!v ? 'Please choose the closest one.' : ''),
  message: (v) => (v.trim().length < 10 ? 'A sentence or two about the space is enough.' : ''),
}

const EMPTY = { name: '', email: '', phone: '', projectType: '', message: '' }

/** The closing call, then the form. */
export default function Contact() {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const scrollTo = useScrollTo()

  useEffect(() => {
    if (reduced) return
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-cta-media] img',
        { scale: 1.16, yPercent: -3 },
        {
          scale: 1.16,
          yPercent: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-cta-media]',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={root}>
      {/* ——— Call to action ——— */}
      <section
        data-nav-dark
        className="relative flex min-h-[80svh] items-center overflow-hidden bg-ink py-24 text-limewash md:min-h-[90svh]"
        aria-labelledby="cta-heading"
      >
        <div data-cta-media className="absolute inset-0 opacity-40">
          <Figure
            slug="mb-photo-living"
            alt=""
            sizes="100vw"
            className="h-full w-full"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(42,35,32,0.92) 0%, rgba(42,35,32,0.72) 50%, rgba(42,35,32,0.55) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="shell relative z-10">
          <Reveal className="mb-10 flex items-baseline gap-6">
            <span className="label-light shrink-0">07 — Start</span>
            <span className="block h-px w-full bg-limewash-16" />
          </Reveal>

          <SplitLines
            id="cta-heading"
            text="Tell us about the house."
            className="d1 max-w-[11ch] font-display text-limewash"
          />

          <Reveal delay={0.2} className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[44ch] text-body text-limewash/70 text-pretty md:text-body-lg">
              Send the rooms you want to work on and roughly when you would like to
              start. We will come back with what is possible and what it takes.
            </p>
            <button
              type="button"
              onClick={() => scrollTo('#contact', { offset: -20 })}
              className="btn shrink-0"
            >
              Book a consultation
            </button>
          </Reveal>
        </div>
      </section>

      {/* ——— Form ——— */}
      <section
        id="contact"
        className="section-pad scroll-mt-20 bg-limewash"
        aria-labelledby="contact-heading"
      >
        <div className="shell grid gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal className="mb-10 flex items-baseline gap-6">
              <span className="label shrink-0">08 — Contact</span>
              <span className="rule mb-1" />
            </Reveal>

            <SplitLines
              id="contact-heading"
              text="Write to us."
              className="d3 mb-8 font-display"
            />

            <Reveal className="space-y-8">
              <p className="max-w-measure text-body text-ink-60 text-pretty">
                The more specific you are, the more useful our first reply will be —
                which rooms, what is already there, and what is bothering you about it now.
              </p>

              <div className="space-y-5 border-t border-ink-12 pt-7">
                <div>
                  <p className="label mb-2">Instagram</p>
                  <a
                    href={BRAND.instagram.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-rule text-body"
                  >
                    {BRAND.instagram.handle}
                  </a>
                </div>
                {BRAND.email && (
                  <div>
                    <p className="label mb-2">Email</p>
                    <a href={`mailto:${BRAND.email}`} className="link-rule text-body">
                      {BRAND.email}
                    </a>
                  </div>
                )}
                {BRAND.phone && (
                  <div>
                    <p className="label mb-2">Phone</p>
                    <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`} className="link-rule text-body">
                      {BRAND.phone}
                    </a>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8 lg:pl-8">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </div>
  )
}

function EnquiryForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const liveRef = useRef(null)

  const setField = (name) => (e) => {
    const value = e.target.value
    setValues((v) => ({ ...v, [name]: value }))
    // Only re-validate a field the visitor has already left once, so the form
    // never shouts at someone mid-word.
    if (touched[name]) setErrors((s) => ({ ...s, [name]: FIELDS[name](value) }))
  }

  const blur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors((s) => ({ ...s, [name]: FIELDS[name](values[name]) }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const next = Object.fromEntries(
      Object.entries(FIELDS).map(([k, fn]) => [k, fn(values[k])]),
    )
    setErrors(next)
    setTouched(Object.fromEntries(Object.keys(FIELDS).map((k) => [k, true])))

    const firstBad = Object.keys(next).find((k) => next[k])
    if (firstBad) {
      document.getElementById(`f-${firstBad}`)?.focus()
      return
    }

    setStatus('sending')
    window.setTimeout(() => {
      // No form endpoint and no studio email address were provided, so the
      // enquiry is handed straight to the visitor rather than posted into a
      // void. With BRAND.email filled in, this becomes a normal mail handoff;
      // point `onSubmit` at a real endpoint and both branches can go away.
      if (BRAND.email) {
        window.location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent(
          `Enquiry — ${values.projectType}`,
        )}&body=${encodeURIComponent(composeEnquiry(values))}`
      }
      setStatus('sent')
    }, 350)
  }

  if (status === 'sent') return <Composed values={values} onReset={() => {
    setValues(EMPTY)
    setErrors({})
    setTouched({})
    setStatus('idle')
  }} />

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <Field
        id="f-name"
        label="Name"
        value={values.name}
        onChange={setField('name')}
        onBlur={blur('name')}
        error={touched.name ? errors.name : ''}
        autoComplete="name"
        required
      />
      <Field
        id="f-email"
        label="Email"
        type="email"
        inputMode="email"
        value={values.email}
        onChange={setField('email')}
        onBlur={blur('email')}
        error={touched.email ? errors.email : ''}
        autoComplete="email"
        required
      />
      <Field
        id="f-phone"
        label="Phone"
        hint="Optional"
        type="tel"
        inputMode="tel"
        value={values.phone}
        onChange={setField('phone')}
        onBlur={blur('phone')}
        error={touched.phone ? errors.phone : ''}
        autoComplete="tel"
      />
      <Field
        id="f-projectType"
        label="Project"
        as="select"
        value={values.projectType}
        onChange={setField('projectType')}
        onBlur={blur('projectType')}
        error={touched.projectType ? errors.projectType : ''}
        required
      >
        <option value="">Choose one</option>
        {PROJECT_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Field>

      <div className="sm:col-span-2">
        <Field
          id="f-message"
          label="About the space"
          as="textarea"
          rows={5}
          value={values.message}
          onChange={setField('message')}
          onBlur={blur('message')}
          error={touched.message ? errors.message : ''}
          hint="Which rooms, and what is there now"
          required
        />
      </div>

      <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[34ch] text-body text-ink-40">
          We reply to every enquiry ourselves.
        </p>
        <button type="submit" className="btn w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? 'One moment' : 'Send enquiry'}
        </button>
      </div>
    </form>
  )
}

const composeEnquiry = (v) =>
  [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.phone ? `Phone: ${v.phone}` : null,
    `Project: ${v.projectType}`,
    '',
    v.message,
  ]
    .filter(Boolean)
    .join('\n')

/** Confirmation. Shows the composed enquiry and a way to get it to the studio. */
function Composed({ values, onReset }) {
  const [copied, setCopied] = useState(false)
  const text = composeEnquiry(values)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="border border-ink-12 p-8 md:p-12" role="status" aria-live="polite">
      <p className="label mb-5">Enquiry ready</p>
      <h3 className="d4 mb-4 font-display">
        {BRAND.email ? 'Your email is open.' : 'Thank you — one step left.'}
      </h3>
      <p className="max-w-measure text-body text-ink-60 text-pretty">
        {BRAND.email ? (
          <>
            We have put the details into a message for you to send. If your mail client
            did not open, copy the enquiry below and send it to{' '}
            <a href={`mailto:${BRAND.email}`} className="link-rule">
              {BRAND.email}
            </a>
            .
          </>
        ) : (
          <>
            Copy the enquiry below and send it to us as a direct message on Instagram.
            We read every one.
          </>
        )}
      </p>

      <pre className="mt-7 max-h-64 overflow-auto whitespace-pre-wrap border-l-2 border-terracotta bg-plaster p-5 font-sans text-body text-ink">
        {text}
      </pre>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="button" onClick={copy} className="btn">
          {copied ? 'Copied' : 'Copy enquiry'}
        </button>
        <a
          href={BRAND.instagram.url}
          target="_blank"
          rel="noreferrer noopener"
          className="btn-ghost"
        >
          Message on Instagram
        </a>
        <button type="button" onClick={onReset} className="label self-start sm:ml-2 sm:self-auto">
          Start again
        </button>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  as = 'input',
  children,
  required,
  className = '',
  ...rest
}) {
  const Tag = as
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      <label htmlFor={id} className="label mb-3 flex items-baseline justify-between gap-3">
        <span>
          {label}
          {required && <span className="text-terracotta"> *</span>}
        </span>
        {hint && (
          <span id={`${id}-hint`} className="!text-ink-40 normal-case tracking-normal">
            {hint}
          </span>
        )}
      </label>

      <Tag
        id={id}
        name={id.replace('f-', '')}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        className={`w-full appearance-none border-0 border-b bg-transparent px-0 py-3 text-body text-ink
          transition-colors duration-400 ease-arch placeholder:text-ink-40
          focus:border-clay focus:outline-none focus-visible:outline-none
          ${error ? 'border-b-clay' : 'border-b-ink-12'}
          ${as === 'textarea' ? 'resize-y' : ''}
          ${as === 'select' ? 'cursor-pointer bg-[right_0.25rem_center] bg-no-repeat pr-8' : ''}`}
        style={
          as === 'select'
            ? {
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%232A2320' stroke-width='1'/%3E%3C/svg%3E\")",
                backgroundSize: '12px 8px',
              }
            : undefined
        }
        {...rest}
      >
        {children}
      </Tag>

      {error && (
        <p id={`${id}-error`} className="mt-2 text-body text-clay" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
