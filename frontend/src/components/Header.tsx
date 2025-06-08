interface HeaderProps {
  title: string;
  description?: string;
}

const Header = ({ title, description }: HeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-green-100 shrink-0">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
