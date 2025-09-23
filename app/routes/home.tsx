import ResumeCard from "~/components/ResumeCard";
import { resumes } from "../../constants";
import Navbar from "~/components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback for your dream job!" },
  ];
}

export default function Home() {
  return (
  <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track your Applications & Resume Ratings</h1>
        <h2>Review your submission and check AI-powered Feedback.</h2>
      </div>
    {resumes.length > 0 && (
      <div className="resumes-section">
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume}/>
        ))}
      </div>
    )}
    </section>

  </main>
  );
}
