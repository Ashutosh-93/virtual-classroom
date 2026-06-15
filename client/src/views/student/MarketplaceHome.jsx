import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MarketplaceHome() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mocking the incoming payload format verified by Section 2.1 of your API document
  useEffect(() => {
    const fetchDiscoveryCatalog = async () => {
      try {
        // Replace with direct Axios or Fetch node call referencing `http://localhost:5000/api/course`
        const sampleApiResponse = {
          success: true,
          courses: [
            {
              _id: "64a9b8c7d6e5f4a3b2c10101",
              title: "Full-Stack MERN Architecture Production Course",
              description: "Build robust distributed backend configurations, secure HTTP-only cookie tracking nodes, and handle modular state architectures using Redux.",
              price: 4999,
              thumbnail: "",
              teacher: { fullName: "Ashutosh Kumar", profilePic: "" }
            },
            {
              _id: "64a9b8c7d6e5f4a3b2c10102",
              title: "Advanced React Systems Design & Engineering",
              description: "Master performance-tuned shell layout routing, custom hooks extraction pipelines, and advanced conditional compilation view trees.",
              price: 3499,
              thumbnail: "",
              teacher: { fullName: "Jane Smith", profilePic: "" }
            }
          ]
        };
        setCourses(sampleApiResponse.courses);
      } catch (err) {
        console.error("Error connecting with system course index endpoints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscoveryCatalog();
  }, []);

  if (loading) {
    return <div className="text-sm font-mono text-neutral-400 animate-pulse py-8">Loading available academy blueprints...</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Engineering Blueprints</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Acquire curated premium paths from verified domain instructors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <article 
            key={course._id}
            className="bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
          >
            <div className="p-5 space-y-4">
              <div className="h-40 w-full rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-center text-3xl">
                📦
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between bg-neutral-50/50 dark:bg-[#141414]/20">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Tuition Cost</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-200">₹{course.price}</span>
              </div>
              <Link 
                to={`/course/${course._id}`}
                className="h-8 px-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center shadow-sm transition-colors"
              >
                Inspect Path
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}