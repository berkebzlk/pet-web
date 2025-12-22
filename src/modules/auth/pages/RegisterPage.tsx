import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { registerSchema, type RegisterSchema } from '../schemas/auth.schema';
import { useRegister } from '../hooks/useAuth';

export function RegisterPage() {
    const { t } = useTranslation();
    const { mutate: registerUser, isPending } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterSchema) => {
        registerUser(data);
    };

    return (
        <Card className="border-none shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-brand-coral">
                    {t('auth.register.title')}
                </CardTitle>
                <CardDescription className="text-center">
                    {t('auth.register.subtitle')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('auth.fields.name')}
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.name ? 'border-destructive' : 'border-input'}`}
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{t(errors.name.message || 'auth.validation.required')}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('auth.fields.email')}
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.email ? 'border-destructive' : 'border-input'}`}
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{t(errors.email.message || 'auth.validation.email')}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('auth.fields.password')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.password ? 'border-destructive' : 'border-input'}`}
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{t(errors.password.message || 'auth.validation.required')}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password_confirmation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('auth.fields.passwordConfirmation')}
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.password_confirmation ? 'border-destructive' : 'border-input'}`}
                            {...register('password_confirmation')}
                        />
                        {errors.password_confirmation && (
                            <p className="text-sm text-destructive">{t(errors.password_confirmation.message || 'auth.validation.passwordMatch')}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white" disabled={isPending}>
                        {isPending ? t('common.loading') : t('auth.register.submit')}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                <div>
                    {t('auth.register.hasAccount')}{' '}
                    <Link to="/auth/login" className="font-medium text-brand-teal hover:underline">
                        {t('auth.register.login')}
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
