import RetrievePage from "@/components/ui/custom-things/RetrievePage";

export const metadata = {
  title: "Retrieve Your Shared Images | Image Shared",
  description: "Access your temporarily shared images securely with your unique code. Fast and secure image retrieval with automatic deletion after 24 Hours for privacy.",
  keywords: "image retrieval, free image, how to share image to pc, mobile se pc mein photo kese dalein, secure sharing, temporary images, file access, image download, Image Shared",
  openGraph: {
    title: "Retrieve Shared Images | Image Shared",
    description: "Access your shared images securely with automatic deletion after viewing. Quick and private image retrieval.",
    type: "website",
    locale: "en_US",
    siteName: "Image Shared",
    images: [{
      url: "/og-retrieve.jpg",
      width: 1200,
      height: 630,
      alt: "Image Shared Retrieval Page"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Retrieve Your Shared Images | Image Shared",
    description: "Access your shared images securely with automatic deletion",
    images: ["/twitter-retrieve.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Image Retrieval - Image Shared",
  "description": "Secure page for retrieving temporarily shared images",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://imageshared.vercel.app/retrieve"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "applicationCategory": "MultimediaApplication",
  "featureList": [
    "Secure image retrieval",
    "Automatic file deletion",
    "Private sharing codes",
    "Fast download speeds"
  ]
};

export default function RETRIEVE_PAGE() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main role="main" aria-label="Image retrieval interface">
        <RetrievePage />
      </main>
    </>
  );
}