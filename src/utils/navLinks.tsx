import {
  IconChartBar,
  IconCreditCard,
  IconExclamationCircle,
  IconLifebuoy,
  IconMessage,
  IconSettings,
  IconSmartHome,
  IconTruck,
} from "@tabler/icons-react";

export const navLink = [
  {
    type: "main-menu",
    title: "Main Menu",
    items: [
      {
        title: "Dashboard",
        icon: <IconSmartHome size="24" />,
        path: "/",
      },
      {
        title: "Shipments",
        icon: <IconTruck size="24" />,
        path: "/shipments",
      },
      {
        title: "Orders",
        icon: <IconChartBar size="24" />,
        path: "/orders",
      },
      {
        title: "Messages",
        icon: <IconMessage size="24" />,
        path: "/messages",
      },
      {
        title: "Customers",
        icon: <IconCreditCard size="24" />,
        path: "/customers",
      },
    ],
  },
  {
    type: "management",
    title: "Management",
    items: [
      {
        title: "Help",
        icon: <IconExclamationCircle size="24" />,
        path: "/help",
      },
      {
        title: "Support",
        icon: <IconLifebuoy size="24" />,
        path: "/support",
      },
      {
        title: "Settings",
        icon: <IconSettings size="24" />,
        path: "/settings/profile",
      },
    ],
  },
];
