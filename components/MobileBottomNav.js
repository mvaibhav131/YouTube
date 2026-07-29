import Link from "next/link";
import { useRouter } from "next/router";
import {
  HomeOutlined,
  HomeFilled,
  ThunderboltOutlined,
  ThunderboltFilled,
  PlaySquareOutlined,
  PlaySquareFilled,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

const NAV = [
  { href: "/", label: "Home", Icon: HomeOutlined, ActiveIcon: HomeFilled },
  {
    href: "/shorts",
    label: "Shorts",
    Icon: ThunderboltOutlined,
    ActiveIcon: ThunderboltFilled,
  },
  {
    href: "/subscriptions",
    label: "Subscriptions",
    Icon: PlaySquareOutlined,
    ActiveIcon: PlaySquareFilled,
  },
  {
    href: "/search",
    label: "Search",
    Icon: SearchOutlined,
    ActiveIcon: SearchOutlined,
  },
  {
    href: "/login",
    label: "You",
    Icon: UserOutlined,
    ActiveIcon: UserOutlined,
  },
];

export default function MobileBottomNav() {
  const router = useRouter();

  return (
    <nav className="yt-bottom-nav">
      {NAV.map(({ href, label, Icon, ActiveIcon }) => {
        const isActive =
          href === "/"
            ? router.pathname === "/"
            : router.pathname.startsWith(href);
        const Ico = isActive ? ActiveIcon : Icon;
        return (
          <Link
            key={href}
            href={href}
            className={`yt-bottom-nav-item${isActive ? " active" : ""}`}
          >
            <Ico style={{ fontSize: 22 }} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
