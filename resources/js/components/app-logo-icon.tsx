interface AppLogoIconProps {
    className?: string;
}

export default function AppLogoIcon({ className }: AppLogoIconProps) {
    return (
        <img
            src="/logo.png"
            alt="Logo"
            className={className}
        />
    );
}
