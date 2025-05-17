import { Checkout } from "@/components/checkout/checkout"
import { HeaderPage } from "@/components/Header/header-page"

export default function Home() {
  return (
    <div>
      <main className="min-h-screen bg-gradient-to-b from-[#FFCDE2] to-[#FCFCF7] flex items-center justify-center p-4">
        <Checkout />
      </main>
    </div>
  )
}

