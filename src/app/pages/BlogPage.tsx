import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";
import { motion } from "motion/react";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const blogPosts = [
    {
      id: 1,
      title: "10 Common Interview Mistakes and How to Avoid Them",
      excerpt: "Learn about the most common pitfalls candidates face during interviews and practical strategies to overcome them.",
      author: "Sarah Johnson",
      date: "February 28, 2026",
      readTime: "5 min read",
      category: "Interview Tips",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    },
    {
      id: 2,
      title: "How to Answer 'Tell Me About Yourself' Like a Pro",
      excerpt: "Master the most common interview question with a structured approach that highlights your strengths and experience.",
      author: "Michael Chen",
      date: "February 25, 2026",
      readTime: "4 min read",
      category: "Career Advice",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    },
    {
      id: 3,
      title: "The STAR Method: Your Secret Weapon for Behavioral Questions",
      excerpt: "Discover how to structure compelling answers using the Situation, Task, Action, Result framework.",
      author: "Emily Rodriguez",
      date: "February 22, 2026",
      readTime: "6 min read",
      category: "Interview Tips",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    },
    {
      id: 4,
      title: "Remote Interview Success: Setting Up Your Virtual Space",
      excerpt: "Essential tips for creating a professional environment and making a great impression in virtual interviews.",
      author: "David Kim",
      date: "February 20, 2026",
      readTime: "5 min read",
      category: "Remote Work",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    },
    {
      id: 5,
      title: "Negotiating Your Salary: A Complete Guide for 2026",
      excerpt: "Learn proven strategies to negotiate your worth and secure the compensation package you deserve.",
      author: "Jessica Martinez",
      date: "February 18, 2026",
      readTime: "8 min read",
      category: "Career Advice",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    },
    {
      id: 6,
      title: "How AI is Transforming the Interview Process",
      excerpt: "Explore how artificial intelligence is changing recruitment and what it means for job seekers in the modern market.",
      author: "Alex Thompson",
      date: "February 15, 2026",
      readTime: "7 min read",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    },
  ];

  const categories = ["All", "Interview Tips", "Career Advice", "Remote Work", "Technology"];

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F8FAFC] to-white py-16 lg:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "2.5rem",
                color: "#1E293B",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
                lineHeight: 1.2,
              }}
            >
              InterVox Blog
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.125rem",
                color: "#64748B",
                lineHeight: 1.7,
              }}
            >
              Expert insights, interview tips, and career advice to help you land your dream job
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-10"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl border-2 transition-all ${
                  category === selectedCategory
                    ? "bg-[#2563EB] border-[#2563EB] text-white shadow-lg shadow-blue-500/25"
                    : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]"
                }`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#BFDBFE] transition-all group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "#2563EB",
                      }}
                    >
                      <Tag size={12} strokeWidth={2} />
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#1E293B",
                      marginBottom: "12px",
                      lineHeight: 1.3,
                    }}
                    className="group-hover:text-[#2563EB] transition-colors"
                  >
                    {post.title}
                  </h2>

                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#64748B",
                      lineHeight: 1.7,
                      marginBottom: "16px",
                    }}
                  >
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#94A3B8]" strokeWidth={2} />
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          color: "#64748B",
                        }}
                      >
                        {post.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[#94A3B8]">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} strokeWidth={2} />
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          {post.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1.5 text-[#94A3B8]">
                      <Clock size={14} strokeWidth={2} />
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                        }}
                      >
                        {post.readTime}
                      </span>
                    </div>

                    <button
                      className="flex items-center gap-1.5 text-[#2563EB] group-hover:gap-2.5 transition-all"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      Read More
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* No results message */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1rem",
                  color: "#64748B",
                }}
              >
                No articles found in this category.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {filteredPosts.length > 0 && (
            <div className="flex justify-center mt-12">
              <button
                className="flex items-center gap-2 bg-white border-2 border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#1E293B] hover:text-[#2563EB] px-7 py-3.5 rounded-xl transition-all"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Load More Articles
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
