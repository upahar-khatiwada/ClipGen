interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard = ({ icon, title, desc }: FeatureCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
      <div className="bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

export default FeatureCard;
