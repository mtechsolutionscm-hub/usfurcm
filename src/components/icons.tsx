import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faUser as faUserR,
  faMessage as faMessageR,
  faCompass as faCompassR,
  faStar as faStarR,
  faHeart as faHeartR,
  faLightbulb as faLightbulbR,
  faComment as faCommentR,
  faEnvelope as faEnvelopeR,
  faCalendarCheck as faCalendarCheckR,
  faHandshake as faHandshakeR,
  faClock as faClockR,
  faBuilding as faBuildingR,
  faFileLines as faFileLinesR,
  faCircleQuestion as faCircleQuestionR,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faXmark,
  faUserPlus,
  faRightToBracket,
  faArrowRight,
  faArrowLeft,
  faClipboardCheck,
  faArrowTrendUp,
  faScaleBalanced,
  faGraduationCap,
  faGlobe,
  faEarthAfrica,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faBolt,
  faAward,
  faShieldHalved,
  faLocationDot,
  faPhone,
  faArrowUpRightFromSquare,
  faWandMagicSparkles,
  faBookOpen,
  faUsers,
  faHouse,
  faCoins,
  faBriefcase,
  faPiggyBank,
  faLandmark,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";

type IconProps = {
  className?: string;
  size?: number | string;
  color?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  "aria-hidden"?: boolean;
};

const make = (icon: IconDefinition) => {
  const Cmp = ({ className, size, color, onClick, ...rest }: IconProps) => (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      style={size ? { width: size, height: size, color } : color ? { color } : undefined}
      onClick={onClick as unknown as FontAwesomeIconProps["onClick"]}
      {...rest}
    />
  );
  return Cmp;
};

// Navigation & UI
export const Menu = make(faBars);
export const X = make(faXmark);
export const User = make(faUserR);
export const UserPlus = make(faUserPlus);
export const LogIn = make(faRightToBracket);
export const ArrowRight = make(faArrowRight);
export const ArrowLeft = make(faArrowLeft);
export const ChevronDown = make(faChevronDown);
export const ChevronUp = make(faChevronUp);
export const ChevronLeft = make(faChevronLeft);
export const ChevronRight = make(faChevronRight);
export const ExternalLink = make(faArrowUpRightFromSquare);
export const Home = make(faHouse);

// Messaging
export const MessageSquare = make(faMessageR);
export const MessageCircle = make(faCommentR);
export const Mail = make(faEnvelopeR);
export const Phone = make(faPhone);
export const MapPin = make(faLocationDot);

// Services / finance
export const Compass = make(faCompassR);
export const ClipboardCheck = make(faClipboardCheck);
export const Building2 = make(faBuildingR);
export const TrendingUp = make(faArrowTrendUp);
export const Scale = make(faScaleBalanced);
export const GraduationCap = make(faGraduationCap);
export const Globe = make(faGlobe);
export const Globe2 = make(faEarthAfrica);
export const Coins = make(faCoins);
export const FileText = make(faFileLinesR);
export const Briefcase = make(faBriefcase);
export const PiggyBank = make(faPiggyBank);
export const Landmark = make(faLandmark);
export const HandCoins = make(faHandHoldingDollar);

// Values / marketing
export const Check = make(faCheck);
export const Zap = make(faBolt);
export const Award = make(faAward);
export const Shield = make(faShieldHalved);
export const Star = make(faStarR);
export const Heart = make(faHeartR);
export const Lightbulb = make(faLightbulbR);
export const Sparkles = make(faWandMagicSparkles);
export const CalendarCheck = make(faCalendarCheckR);
export const Handshake = make(faHandshakeR);
export const BookOpen = make(faBookOpen);
export const Clock = make(faClockR);
export const Users = make(faUsers);
export const HelpCircle = make(faCircleQuestionR);
