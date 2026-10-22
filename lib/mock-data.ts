export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ComplaintStatus = "SUBMITTED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED";
export type Complaint = { id: string; title: string; description: string; category: string; subcategory: string; priority: Priority; location: string; department: string; status: ComplaintStatus; createdAt: string; updatedAt: string; imageUrl?: string };

export const complaints: Complaint[] = [
  { id: "CF-1024", title: "Water Leakage", description: "Water is leaking outside C Block Room 204 and pooling near the entrance.", category: "Plumbing", subcategory: "Water leakage", priority: "HIGH", location: "C Block · Room 204", department: "Maintenance", status: "IN_PROGRESS", createdAt: "Today, 10:42 AM", updatedAt: "Today, 11:08 AM", imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80" },
  { id: "CF-1023", title: "Wi-Fi Not Working", description: "The Wi-Fi is unavailable across the second floor.", category: "Technology", subcategory: "Network", priority: "MEDIUM", location: "C Block · 2nd Floor", department: "IT Services", status: "RESOLVED", createdAt: "Yesterday", updatedAt: "Yesterday" },
  { id: "CF-1022", title: "Broken Classroom Light", description: "One light fixture is not working.", category: "Electrical", subcategory: "Lighting", priority: "LOW", location: "A Block · Room 301", department: "Maintenance", status: "SUBMITTED", createdAt: "Sep 22", updatedAt: "Sep 22" }
];

export const getComplaint = (id: string) => complaints.find((complaint) => complaint.id === id) ?? complaints[0];
