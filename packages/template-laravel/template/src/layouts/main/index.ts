import "components/Footer";
import { Header } from "components/Header";
import "utils/btn.scss";
import "utils/fonts.scss";
import "utils/logo.scss";
import "@olmokit/core/debug/api";
import "@olmokit/core/grid/index.scss";
import "@olmokit/core/icon/index.scss";
import "@olmokit/core/img";
import LazyLoad from "@olmokit/core/lazy";
import "@olmokit/core/reboot/index.scss";
import "@olmokit/core/typography/reset.scss";
import "./index.scss";

Header();

new LazyLoad();
