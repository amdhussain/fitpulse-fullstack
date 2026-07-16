import { FiUpload } from "react-icons/fi";

const borderColors = {
  blue: "hover:border-blue-400",
  orange: "hover:border-orange-400",
  purple: "hover:border-purple-400",
  indigo: "hover:border-indigo-400",
  emerald: "hover:border-emerald-400",
  cyan: "hover:border-cyan-400",
  yellow: "hover:border-yellow-400",
  pink: "hover:border-pink-400",
  sky: "hover:border-sky-400",
  red: "hover:border-red-400",
  slate: "hover:border-slate-400",
  violet: "hover:border-violet-400",
};

const iconColors = {
  blue: "group-hover:text-blue-500",
  orange: "group-hover:text-orange-500",
  purple: "group-hover:text-purple-500",
  indigo: "group-hover:text-indigo-500",
  emerald: "group-hover:text-emerald-500",
  cyan: "group-hover:text-cyan-500",
  yellow: "group-hover:text-yellow-500",
  pink: "group-hover:text-pink-500",
  sky: "group-hover:text-sky-500",
  red: "group-hover:text-red-500",
  slate: "group-hover:text-slate-500",
  violet: "group-hover:text-violet-500",
};

function FileUpload({ label, value, onChange, color = "blue" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <label
        className={`flex items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed border-gray-200 ${borderColors[color] || borderColors.blue} transition-colors cursor-pointer group hover:bg-gray-50`}
      >
        <FiUpload
          className={`w-5 h-5 text-gray-300 ${iconColors[color] || iconColors.blue} transition-colors`}
        />
        <span className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors">
          {value || "Click to upload image"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
          aria-label={label}
        />
      </label>
    </div>
  );
}

export default FileUpload;
