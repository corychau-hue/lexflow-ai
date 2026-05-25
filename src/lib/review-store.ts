export interface ReviewItem {
  id: string;
  title: string;
  type: "AI_SUMMARY" | "AI_WRITING" | "TRANSLATION" | "IMMIGRATION_PACKET";
  caseId?: string;
  clientName?: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: Date;
  details?: string;
}

export async function getReviewItems(): Promise<ReviewItem[]> {
  try {
    const res = await fetch("/api/reviews");
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((item: Record<string, unknown>) => ({
      ...item,
      createdAt: new Date(item.createdAt as string),
    })) as ReviewItem[];
  } catch {
    return [];
  }
}

export async function addReviewItem(item: ReviewItem): Promise<void> {
  try {
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  } catch (err) {
    console.error("Failed to add review item:", err);
  }
}

export async function updateReviewStatus(id: string, status: "APPROVED" | "REJECTED"): Promise<void> {
  try {
    await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    console.error("Failed to update review status:", err);
  }
}
