import ChallengeDetail from "@/components/danhsach/ChallengeDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-12 flex-1 animate-fade-up">
      <ChallengeDetail slug={slug} />
    </div>
  );
}
