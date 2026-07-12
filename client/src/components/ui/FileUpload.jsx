import { FiUpload } from "react-icons/fi";

const borderColors = {
  blue: "hover:border-blue-500/50",
  orange: "hover:border-orange-500/50",
  purple: "hover:border-purple-500/50",
  indigo: "hover:border-indigo-500/50",
  emerald: "hover:border-emerald-500/50",
  cyan: "hover:border-cyan-500/50",
  yellow: "hover:border-yellow-500/50",
  pink: "hover:border-pink-500/50",
  sky: "hover:border-sky-500/50",
  red: "hover:border-red-500/50",
  slate: "hover:border-slate-500/50",
  violet: "hover:border-violet-500/50",
};

const iconColors = {
  blue: "group-hover:text-blue-400",
  orange: "group-hover:text-orange-400",
  purple: "group-hover:text-purple-400",
  indigo: "group-hover:text-indigo-400",
  emerald: "group-hover:text-emerald-400",
  cyan: "group-hover:text-cyan-400",
  yellow: "group-hover:text-yellow-400",
  pink: "group-hover:text-pink-400",
  sky: "group-hover:text-sky-400",
  red: "group-hover:text-red-400",
  slate: "group-hover:text-slate-400",
  violet: "group-hover:text-violet-400",
};

function FileUpload({ label, value, onChange, color = "blue" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-base-content/70 mb-1.5">
        {label}
      </label>
      <label
        className={`flex items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed border-gray-800/60 ${borderColors[color] || borderColors.blue} transition-colors cursor-pointer group`}
      >
        <FiUpload
          className={`w-5 h-5 text-base-content/30 ${iconColors[color] || iconColors.blue} transition-colors`}
        />
        <span className="text-sm text-base-content/40 group-hover:text-base-content/60 transition-colors">
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
