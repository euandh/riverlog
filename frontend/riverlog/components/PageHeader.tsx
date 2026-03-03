import Link from 'next/link';

export default function PageHeader({
  breadcrumbs,
  title,
  subtitle,
}: {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 border-b pb-6">
      {/* The Uniform Breadcrumb Trail */}
      <nav className="text-sm text-gray-500 mb-4 flex gap-2">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex gap-2">
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              // If there is no href, it's the current page, so make it bold
              <span className="font-semibold text-gray-900">{crumb.label}</span>
            )}
            {/* Add a slash between items, but not after the last one */}
            {index < breadcrumbs.length - 1 && <span>/</span>}
          </span>
        ))}
      </nav>

      {/* The Uniform Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
      {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
}