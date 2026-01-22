interface SubscriptionCardProps {
  title: string;
  price: string;
  selected: boolean;
  onSelect: () => void;
  description?: string[];
}

const SubscriptionCard = ({
  title,
  price,
  selected,
  onSelect,
  description,
}: SubscriptionCardProps) => {
  return (
    <div
      className={`flex-1 border rounded-2xl p-6 flex flex-col justify-between transition-shadow duration-200 ${
        selected ? "border-indigo-600 shadow-lg" : "border-gray-200"
      }`}
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-500 mb-4">{price}</p>
        {description && (
          <ul className="text-slate-400 text-sm list-disc list-inside space-y-1">
            {description.map((perk, i) => (
              <li key={i}>{perk}</li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={onSelect}
        className={`px-4 py-2 rounded-xl w-full font-semibold transition duration-200 cursor-pointer ${
          selected
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-gray-100 text-slate-700 hover:bg-gray-200"
        }`}
      >
        {selected ? "Selected" : "Select"}
      </button>
    </div>
  );
};

export default SubscriptionCard;
