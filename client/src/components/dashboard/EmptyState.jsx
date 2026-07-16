import { getTheme } from "../../lib/dashboardTheme";
import { FiInbox } from "react-icons/fi";

function EmptyState({ pageKey = "dashboard", message = "No items yet", action }) {
  const theme = getTheme(pageKey);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className={`p-5 rounded-2xl ${theme.iconBg} mb-4`}>
        <FiInbox className={`w-10 h-10 ${theme.emptyIcon}`} />
      </div>
      <p className="text-gray-500 font-medium">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
