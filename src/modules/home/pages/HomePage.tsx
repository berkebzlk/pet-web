import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { Section } from '@/shared/components/ui/section';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/components/ui/card';
import { Heart, Stethoscope, ShoppingBag, Home, Search, Calendar } from 'lucide-react';

export function HomePage() {
    const { t } = useTranslation();

    const features = [
        {
            key: 'dating',
            icon: Heart,
            color: 'text-brand-coral',
            bgColor: 'bg-brand-coral/10',
        },
        {
            key: 'health',
            icon: Stethoscope,
            color: 'text-brand-teal',
            bgColor: 'bg-brand-teal/10',
        },
        {
            key: 'shop',
            icon: ShoppingBag,
            color: 'text-brand-yellow',
            bgColor: 'bg-brand-yellow/10',
        },
        {
            key: 'adoption',
            icon: Home,
            color: 'text-brand-coral',
            bgColor: 'bg-brand-coral/10',
        },
        {
            key: 'lostFound',
            icon: Search,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
        {
            key: 'calendar',
            icon: Calendar,
            color: 'text-brand-teal',
            bgColor: 'bg-brand-teal/10',
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <Section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-48">
                {/* Gradient Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-coral/20 blur-3xl opacity-50 animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-teal/30 blur-3xl opacity-50" />
                </div>

                <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-brand-coral to-brand-teal">
                        {t('landing.hero.title')}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                        {t('landing.hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all bg-brand-coral hover:bg-brand-coral/90 text-white border-none" asChild>
                            <Link to="/app">{t('common.getStarted')}</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-2 border-brand-teal text-brand-teal hover:bg-brand-teal/10">
                            Learn More
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Features Grid */}
            <Section className="bg-muted/30">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card key={feature.key} className="group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${feature.color.replace('text-', 'bg-')}`} />
                            <CardHeader>
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                                </div>
                                <CardTitle className="text-xl">{t(`landing.features.${feature.key}.title`)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base leading-relaxed">
                                    {t(`landing.features.${feature.key}.description`)}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Section>

            {/* Trust/Community Section */}
            <Section className="bg-muted/50 text-center">
                <div className="mx-auto max-w-3xl space-y-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        {t('landing.trust.title')}
                    </h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        {t('landing.trust.description')}
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-8">
                        <div className="flex flex-col items-center space-y-2">
                            <span className="text-4xl font-bold">10k+</span>
                            <span className="text-sm text-muted-foreground">{t('landing.trust.stat1')}</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <span className="text-4xl font-bold">500+</span>
                            <span className="text-sm text-muted-foreground">{t('landing.trust.stat2')}</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <span className="text-4xl font-bold">2k+</span>
                            <span className="text-sm text-muted-foreground">{t('landing.trust.stat3')}</span>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
