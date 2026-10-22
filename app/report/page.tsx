"use client";

import { FormEvent, useState } from "react";
import { Navbar } from "@/components/navbar";
import { PageHeader } from "@/components/page-header";
import { ImageUploader } from "@/components/image-uploader";
import { ArrowRight, Pin } from "@/components/icons";

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!description.trim()) {
      alert("Please describe the problem.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          location: location.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      console.log("AI result:", data);

      // Temporary: show the result so we can verify the integration.
      alert(
        `Issue analyzed!\n\nCategory: ${data.ai.category}\nPriority: ${data.ai.priority}\nDepartment: ${data.ai.department}`
      );
    } catch (error) {
      console.error(error);
      alert("Could not analyze the issue. Make sure the AI server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="shell max-w-3xl py-12 sm:py-16">
        <PageHeader
          title="What’s going on?"
          subtitle="Tell us what you found. We’ll figure out the rest."
        />

        <form onSubmit={handleSubmit} className="space-y-7">
          <ImageUploader />

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold"
            >
              Describe the problem
            </label>

            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Water is leaking outside C Block Room 204..."
              className="w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-semibold"
            >
              Where is it?
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Pin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

                <input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. C Block, Room 204"
                  className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-moss-500"
                />
              </div>

              <button
                type="button"
                className="btn-secondary !px-3 text-xs sm:!px-4"
              >
                Use current location
              </button>
            </div>
          </div>

          <p className="rounded-xl bg-moss-50 px-4 py-3 text-sm leading-6 text-moss-700">
            You don&apos;t need to know which department handles this.
            CampusFix will figure that out.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? "Analyzing..." : "Analyze Issue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </main>
    </>
  );
}