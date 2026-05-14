import { MEMBER_NAV_ITEMS, ADMIN_NAV_ITEMS } from "../../utils/dashboardConfig";

const ALL_NAV_ITEMS = [
  ...new Map(
    [...MEMBER_NAV_ITEMS, ...ADMIN_NAV_ITEMS].map((item) => [item.id, item]),
  ).values(),
];

const getTabLabel = (id) =>
  ALL_NAV_ITEMS.find((item) => item.id === id)?.label || id;

const ComingSoon = ({ tabId }) => (
  <div className="dash-coming-soon">
    <div className="dash-coming-soon-card">
      <span className="dash-coming-soon-icon">🚧</span>
      <h2>{getTabLabel(tabId)}</h2>
      <p>
        This section is under construction and will be available in the next
        phase.
      </p>
    </div>
  </div>
);

export default ComingSoon;
