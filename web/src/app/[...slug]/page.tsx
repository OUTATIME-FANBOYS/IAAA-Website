import { PageView, pageMetadata } from "@/templates/PageView";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props) {
  return pageMetadata((await params).slug.join("/"));
}

export default async function CmsPage({ params }: Props) {
  return <PageView slug={(await params).slug.join("/")} />;
}
