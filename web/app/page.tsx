import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">PostAgentPro</Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Log in
            </Link>
            <Link href="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Your Social Media. On Autopilot.
            </h1>
            <p className="text-xl lg:text-2xl mb-10 text-blue-100">
              AI-powered posts for your business. 3 times per week. Zero effort required.
            </p>
            <Link 
              href="/signup"
              className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
            >
              Start Free Trial
            </Link>
            <p className="mt-4 text-sm text-blue-200">14 days free, no credit card required</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            You&apos;re Too Busy to Post on Social Media
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">No Time</h3>
              <p className="text-gray-600">
                You&apos;re running jobs, managing crews, handling customers. Who has time to write posts every week?
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🤷</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">No Ideas</h3>
              <p className="text-gray-600">
                What do you even post about? Staring at a blank screen doesn&apos;t help your business grow.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📉</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Inconsistent</h3>
              <p className="text-gray-600">
                You post once, get busy, and disappear for 3 months. Customers forget you exist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
            Set It. Forget It. Grow Your Business.
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            PostAgentPro connects to your Google Business and Facebook pages. Our AI generates professional posts 3x per week. You do nothing.
          </p>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">1. Connect Your Accounts</h3>
              <p className="text-gray-600">
                Link your Google Business Profile and Facebook Page with one click. No technical setup.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">2. We Generate Your Posts</h3>
              <p className="text-gray-600">
                AI creates industry-specific content based on your business type and location. Stock photos included.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">3. Posts Go Live Automatically</h3>
              <p className="text-gray-600">
                3 times per week, every week. Optimized timing. Zero effort from you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Why Contractors Choose PostAgentPro
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">5-Minute Setup</h3>
              <p className="text-gray-600">
                No complicated dashboards. Connect accounts, pick your business type, done.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">True Autopilot</h3>
              <p className="text-gray-600">
                Not just scheduling — we write the posts, find the photos, and publish them.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">$10/Month</h3>
              <p className="text-gray-600">
                Less than a coffee subscription. Cancel anytime.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Proven Results</h3>
              <p className="text-gray-600">
                Businesses with consistent social media get 3x more customer inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Contractors Trust PostAgentPro
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-700 mb-6 italic">
                &quot;I haven&apos;t touched my Facebook page in 6 months, but PostAgentPro keeps it active. I&apos;ve gotten 2 new customers just from people seeing my posts.&quot;
              </p>
              <p className="font-bold text-gray-900">Mike Chen</p>
              <p className="text-sm text-gray-600">Chen Plumbing, Austin TX</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-700 mb-6 italic">
                &quot;Finally, a tool that just works. No learning curve, no logging in every week. It just posts.&quot;
              </p>
              <p className="font-bold text-gray-900">Sarah Lopez</p>
              <p className="text-sm text-gray-600">Lopez Electric, Phoenix AZ</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-700 mb-6 italic">
                &quot;The AI writes better posts than I ever did. And way faster.&quot;
              </p>
              <p className="font-bold text-gray-900">Tom Bradley</p>
              <p className="text-sm text-gray-600">Bradley HVAC, Atlanta GA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Simple Pricing. No Surprises.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$10</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">Perfect for solo contractors</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">3 posts per week</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Google Business Profile</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Facebook Business Page</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">AI-generated content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Stock photos included</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Monthly performance email</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-4 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$30</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">For contractors who want more control</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Everything in Starter</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Instagram posting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Upload your own photos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Approve/reject posts before publishing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Weekly performance summary</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$50</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">Full power, maximum results</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Edit AI-generated captions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Custom scheduling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Competitor tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Advanced analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Start 14-Day Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Questions? We&apos;ve Got Answers.
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-bold text-lg cursor-pointer text-gray-900">
                Do I need to log in every day?
              </summary>
              <p className="mt-4 text-gray-600">
                Nope. With Starter, you literally never log in unless you want to check stats. Pro/Premium users get weekly notifications to approve posts (takes 2 minutes).
              </p>
            </details>
            
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-bold text-lg cursor-pointer text-gray-900">
                What if I don&apos;t like a post?
              </summary>
              <p className="mt-4 text-gray-600">
                Starter posts go out automatically (trust the AI). Pro users can approve/reject before publishing. Premium users can edit captions.
              </p>
            </details>
            
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-bold text-lg cursor-pointer text-gray-900">
                Can I use my own photos?
              </summary>
              <p className="mt-4 text-gray-600">
                Not on Starter (we use professional stock photos). Pro and Premium let you upload job site photos.
              </p>
            </details>
            
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-bold text-lg cursor-pointer text-gray-900">
                What platforms do you support?
              </summary>
              <p className="mt-4 text-gray-600">
                Starter: Google Business + Facebook. Pro adds Instagram. More platforms coming soon.
              </p>
            </details>
            
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-bold text-lg cursor-pointer text-gray-900">
                Will this work for my type of business?
              </summary>
              <p className="mt-4 text-gray-600">
                We&apos;re built for contractors: plumbers, electricians, roofers, HVAC, landscapers, general contractors, and similar service businesses.
              </p>
            </details>
            
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-bold text-lg cursor-pointer text-gray-900">
                Can I cancel anytime?
              </summary>
              <p className="mt-4 text-gray-600">
                Yes. No contracts. Cancel with one click.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Stop Wasting Time on Social Media
          </h2>
          <p className="text-xl mb-10 text-blue-100">
            Let AI handle it. You focus on the work.
          </p>
          <Link 
            href="/signup"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            Start Your Free Trial
          </Link>
          <p className="mt-4 text-sm text-blue-200">
            14 days free. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-xl font-bold text-white mb-2">PostAgentPro</p>
            <p className="text-sm">Built for contractors who have better things to do.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link href="#" className="hover:text-white transition">How It Works</Link>
            <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="#" className="hover:text-white transition">FAQ</Link>
            <Link href="#" className="hover:text-white transition">Support</Link>
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
          </div>
          <div className="text-center text-sm">
            <p>© 2026 PostAgentPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
