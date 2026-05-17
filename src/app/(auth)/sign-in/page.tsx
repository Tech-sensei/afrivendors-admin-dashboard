"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { z } from "zod"
import { signInSchema } from "@/lib/validations/authValidationSchema"
import { useAuthAPI } from "@/services/useAuthAPI"
import imgHeroImage from "../../../../public/assets/images/signUpHeroImg.png"

function getSafeRedirectPath(): string | null {
  if (typeof window === "undefined") return null
  const raw = new URLSearchParams(window.location.search).get("redirect")
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null
  return raw
}

export default function AdminSignInPage() {
  const router = useRouter()
  const { signInAsync, isSigningIn } = useAuthAPI()
  const [formData, setFormData] = useState({ email: "ibraheemtobiloba15@gmail.com", password: "Password@123" })
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  const isDisabled = !formData.email.trim() || !formData.password || isSigningIn

  const handleInputChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const result = signInSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors
      setErrors({
        email: fieldErrors.email?.[0] ?? "",
        password: fieldErrors.password?.[0] ?? "",
      })
      return false
    }
    setErrors({ email: "", password: "" })
    return true
  }

  const handleSignIn = async () => {
    if (!validateForm()) return
    try {
      await signInAsync({ email: formData.email.trim(), password: formData.password })
      router.replace(getSafeRedirectPath() ?? "/dashboard")
    } catch {}
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex max-h-screen flex-col justify-between overflow-y-auto p-6 md:p-8">
          <div className="mx-auto w-full max-w-140">
            <div className="my-12">
              <h1 className="mb-3 font-unbounded text-[clamp(28px,2.6vw,36px)] font-semibold leading-[110%] text-secondary-000">
                Admin Portal
              </h1>
              <p className="font-unageo text-base leading-6 text-accent-80">
                Sign in to your admin account to manage platform operations.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="font-unageo text-base font-normal leading-6 text-secondary-000">Email Address</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleInputChange("email", event.target.value)}
                  className="h-14 rounded-xl border border-accent-20 px-4 font-unageo text-base leading-6 text-secondary-000 outline-none transition-colors duration-200 ease-out focus:border-primary-100"
                  placeholder="e.g admin@afrivendors.com"
                />
                {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-unageo text-base font-normal leading-6 text-secondary-000">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) => handleInputChange("password", event.target.value)}
                    className="h-14 w-full rounded-xl border border-accent-20 pl-4 pr-12 font-unageo text-base leading-6 text-secondary-000 outline-none transition-colors duration-200 ease-out focus:border-primary-100"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((state) => !state)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent p-1 text-accent-80 transition-colors duration-200 hover:text-secondary-000"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
              </label>

              <button
                type="button"
                onClick={() => void handleSignIn()}
                disabled={isDisabled}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-none bg-primary-100 transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90"
              >
                <span className="font-unageo text-base font-semibold leading-5 text-white">
                  {isSigningIn ? "Signing in..." : "Sign In"}
                </span>
                {!isSigningIn ? <ArrowRight className="h-[18px] w-[18px] text-white" /> : null}
              </button>
            </div>
          </div>

          <div className="mx-auto mt-12 flex w-full max-w-140 items-center justify-between gap-4">
            <p className="font-unageo text-sm leading-5 text-accent-80">© {new Date().getFullYear()} Afrivendors.co.uk ltd</p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="bg-transparent p-0 font-unageo text-base font-semibold leading-5 text-secondary-000 underline transition-opacity duration-200 ease-out hover:opacity-70"
            >
              Back Home
            </button>
          </div>
        </div>

        {/* <div className="relative hidden h-screen overflow-hidden rounded-bl-[200px] bg-secondary-000 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_45%),linear-gradient(140deg,#2B180A_0%,#1D0D04_60%,#120802_100%)]" />
          <div className="absolute inset-0 bg-[rgba(29,13,4,0.15)]" />
          <div className="relative z-10 flex h-full items-center justify-center p-12">
            <div className="text-center">
              <Image
                src="/assets/images/Logo.svg"
                alt="Afrivendors"
                width={160}
                height={160}
                className="mx-auto h-28 w-28"
                priority
              />
              <p className="mt-6 font-unbounded text-3xl font-semibold text-white">Afrivendors Admin</p>
              <p className="mt-3 font-unageo text-base text-white/85">Securely manage vendors, payments, and operations.</p>
            </div>
          </div>
        </div> */}

        <div className="hidden lg:block relative bg-secondary-000 overflow-hidden h-screen rounded-bl-[200px]">
          <Image
            src={imgHeroImage}
            alt="Vendor Portal"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[rgba(29,13,4,0.15)]" />
        </div>
      </div>
    </div>
  )
}
