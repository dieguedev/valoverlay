interface SeoProps {
  title: string;
  description: string;
}

export const Seo: React.FC<SeoProps> = ({ title, description }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  );
};
