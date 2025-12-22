import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { loginSchema, type LoginSchema } from '../schemas/auth.schema';
import { useLogin } from '../hooks/useAuth';

export function LoginPage() {
    const { t } = useTranslation();
    const { mutate: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginSchema) => {
        login(data);
    };

    return (
        <Card className="border-none shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-brand-coral">
                    {t('auth.login.title')}
                </CardTitle>
                <CardDescription className="text-center">
                    {t('auth.login.subtitle')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t('auth.fields.password')}
                            </label>
                            <Link
                                to="/auth/forgot-password"
                                className="text-sm font-medium text-brand-teal hover:underline"
                            >
                                {t('auth.login.forgotPassword')}
                            </Link>
                        </div>
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
                    <Button type="submit" className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white" disabled={isPending}>
                        {isPending ? t('common.loading') : t('auth.login.submit')}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                <div>
                    {t('auth.login.noAccount')}{' '}
                    <Link to="/auth/register" className="font-medium text-brand-teal hover:underline">
                        {t('auth.login.createAccount')}
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
