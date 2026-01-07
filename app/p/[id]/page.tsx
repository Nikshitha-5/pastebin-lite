import { prisma } from "@/lib/prisma";

interface PastePageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PastePageProps) {
  // ✅ FIX: await params
  const { id } = await params;

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  return (
    <main style={{ padding: 40 }}>
      <h1>Paste View</h1>

      <p>
        <strong>Paste ID:</strong> {id}
      </p>

      <pre
        style={{
          background: "#f4f4f4",
          padding: 16,
          borderRadius: 6,
          whiteSpace: "pre-wrap",
        }}
      >
        {paste ? paste.content : "❌ Paste not found in DB"}
      </pre>
    </main>
  );
}
