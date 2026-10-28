import { PageView, pageMetadata } from "@/templates/PageView";

export const generateMetadata = () => pageMetadata("home");

export default function HomePage() {
  return <PageView slug="home" />;
}
