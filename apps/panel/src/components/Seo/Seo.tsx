interface SeoProps {
  title: string
  description: string
}

function Seo({ title, description }: SeoProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  )
}

export default Seo
