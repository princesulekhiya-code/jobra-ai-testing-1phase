"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MessageSquare, Calendar, Star, Briefcase, CheckCircle, Clock, Search } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

const MENTORS = [
  { name: "Sarah Chen", title: "Senior Product Designer", company: "Meta", experience: "12+ years", rating: 4.9, reviews: 47, expertise: ["Product Design", "Design Systems", "Mentorship"], sessions: 150, availability: "Available this week", availColor: "green", price: "$120/hr", image: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzc0Nzc5NzE0fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Michael Rodriguez", title: "Design Director", company: "Google", experience: "15+ years", rating: 5.0, reviews: 63, expertise: ["Leadership", "Strategy", "Team Building"], sessions: 200, availability: "Limited spots", availColor: "yellow", price: "$150/hr", image: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NDg2MjM0N3ww&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Emily Watson", title: "Lead UX Researcher", company: "Apple", experience: "10+ years", rating: 4.8, reviews: 38, expertise: ["UX Research", "User Testing", "Data Analysis"], sessions: 95, availability: "Available next week", availColor: "green", price: "$110/hr", image: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzc0Nzc5NzE0fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "David Kim", title: "VP of Design", company: "Airbnb", experience: "18+ years", rating: 4.9, reviews: 52, expertise: ["Career Growth", "Portfolio Review", "Interview Prep"], sessions: 175, availability: "Book 2 weeks ahead", availColor: "gray", price: "$175/hr", image: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NDg2MjM0N3ww&ixlib=rb-4.1.0&q=80&w=1080" },
];

const AVAIL_COLOR: Record<string, string> = {
  green: "bg-primary/10 text-primary border-primary/20",
  yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  gray: "bg-secondary text-muted-foreground border-border",
};

const FILTERS = ["All Mentors", "Product Design", "UX Research", "Leadership", "Career Transition"];

export default function MentorsPage() {
  const [activeFilter, setActiveFilter] = useState("All Mentors");

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 mb-2">✦ Expert Network</p>
          <h1 className="text-2xl font-extrabold text-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Career{" "}
            <span className="warm-text">Mentors</span>
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">Connect with experienced professionals who can accelerate your career growth.</p>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all duration-200 ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_12px_hsl(25_55%_58%/0.25)]"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="w-full sm:w-auto sm:ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input placeholder="Search mentors..." className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 w-full sm:w-48" />
          </div>
        </div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MENTORS.map((mentor, index) => (
            <div key={index} className="bg-card rounded-2xl border border-border p-6 hover:border-primary/20 transition-all duration-200 group">

              {/* Top — Avatar + Info */}
              <div className="flex gap-4 mb-4">
                <div className="relative shrink-0">
                  <ImageWithFallback
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-foreground mb-0.5">{mentor.name}</h3>
                  <p className="text-[12px] text-muted-foreground mb-2 font-medium">{mentor.title} · {mentor.company}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{mentor.experience}</span>
                    <span className="flex items-center gap-1 text-primary">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-bold text-foreground">{mentor.rating}</span>
                      <span className="text-muted-foreground">({mentor.reviews})</span>
                    </span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{mentor.sessions} sessions</span>
                  </div>
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.expertise.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary">{skill}</span>
                ))}
              </div>

              {/* Bottom — Availability + Price + Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border mb-1.5 ${AVAIL_COLOR[mentor.availColor]}`}>
                    <Clock className="w-3 h-3" /> {mentor.availability}
                  </div>
                  <div className="text-[16px] font-extrabold text-foreground">{mentor.price}</div>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-muted-foreground text-[12px] font-semibold hover:bg-secondary hover:text-foreground transition-colors duration-200">
                    <MessageSquare className="w-3.5 h-3.5" /> Message
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold shadow-[0_4px_12px_hsl(25_55%_58%/0.25)] hover:opacity-90 transition-all duration-200">
                    <Calendar className="w-3.5 h-3.5" /> Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
