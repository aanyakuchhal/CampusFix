export function analyzeComplaint(data: {
  description: string;
  imageUrl?: string | null;
  location?: string | null;
}): {
  department: string;
  category: string;
  subcategory: string;
  location: string | null;
  priority: string;
  email_subject: string;
  summary: string;
  suggested_action: string;
  email_body: string;
};