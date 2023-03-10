import styles from "./layout.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} Boerderij bloem
    </footer>
  );
}
