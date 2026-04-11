"use client"

export default function Template() {
  return (
    <main className="about-page">
      <HeroSection />
    </main>
  )
}

const HeroSection = () => {
  return (
    <section className="pt-20! hero min-h-[calc(100vh-80px)] flex items-center" id="about-page">
      <div className="container">
        <h1 className="text-2xl mb-6 w-fit font-medium! uppercase">Blog CMS App</h1>
        <div className="hero-description">
          A full-featured blog management system built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. It allows
          users to create, edit, and manage blogs with customizable metadata like title and description. Authentication
          is fully handled by Firebase, including sign up, login, email verification, password reset, and secure session
          management. Data is stored in Firestore, providing a scalable and flexible backend. The system also includes
          role-based access control with admin and moderator hierarchy for managing users and content permissions.
        </div>
      </div>
    </section>
  )
}
