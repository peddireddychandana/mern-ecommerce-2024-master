import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Smt. Lakshmidevamma",
    location: "Proddatur",
    review:
      "I have been buying sarees from Sri Ramakrishna Textiles for over a decade. The quality of their silk and cotton fabrics is unmatched. Truly a trusted name in Proddatur!",
    rating: 5,
  },
  {
    name: "Venkata Subbaiah",
    location: "Kadapa",
    review:
      "Best place for wedding shopping. Great variety in silks and dress materials at very reasonable prices. The staff are courteous and always ready to help.",
    rating: 5,
  },
  {
    name: "Nagendra Babu",
    location: "Jammalamadugu",
    review:
      "Their shirt materials are of excellent quality. I've been a regular customer for years and have never been disappointed. Highly recommended for men's fabrics.",
    rating: 4,
  },
  {
    name: "Smt. Padmavathi",
    location: "Proddatur",
    review:
      "The traditional cotton sarees here are simply beautiful. Perfect for daily wear and festivals alike. Fair pricing and friendly service every single time.",
    rating: 5,
  },
  {
    name: "Siva Krishna",
    location: "Pulivendula",
    review:
      "I drive all the way from Pulivendula just to shop here. That's how good this place is! The variety in kids' clothing and fabrics is wonderful.",
    rating: 5,
  },
  {
    name: "Anitha Reddy",
    location: "Mydukur",
    review:
      "Excellent customer service and top-notch quality. They helped me choose the perfect bridal saree for my daughter's wedding. Forever grateful!",
    rating: 5,
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm tracking-[4px] uppercase text-[#6B1E2E] font-medium">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">
            What Our Customers Say
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#6B1E2E] to-yellow-500 mx-auto mt-4" />
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Trusted by families across Rayalaseema for generations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-[#6B1E2E]/5 group-hover:text-[#6B1E2E]/10 transition-colors" />

              <StarRating rating={t.rating} />

              <p className="mt-4 text-gray-600 leading-relaxed text-sm min-h-[80px]">
                &ldquo;{t.review}&rdquo;
              </p>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="font-semibold text-gray-900 text-sm">
                  {t.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
