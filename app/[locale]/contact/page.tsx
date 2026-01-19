'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Contact form data:', data);
    setSuccess(true);
    setLoading(false);
    reset();

    // Reset success message after 5 seconds
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="bg-brand-black min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-black-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{t('title')}</h1>
            <div className="h-1 w-24 bg-brand-red mb-6 mx-auto"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-brand-black-light border border-brand-black-light rounded-sm p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {locale === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}
              </h2>

              {success && (
                <div className="bg-green-500/10 border border-green-500 rounded-sm p-4 mb-6">
                  <p className="text-green-400">{t('success')}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('name')} *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-brand-red">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('email')} *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-brand-red">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('subject')} *
                  </label>
                  <input
                    type="text"
                    {...register('subject')}
                    className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-brand-red">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('message')} *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-brand-red">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors disabled:bg-gray-600 uppercase tracking-wider"
                >
                  {loading ? (locale === 'fr' ? 'Envoi...' : 'Sending...') : t('send')}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-brand-black-light border border-brand-black-light rounded-sm p-8">
                <h2 className="text-2xl font-bold text-white mb-6">{t('info.title')}</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-brand-red mr-4 mt-1">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{t('info.address')}</h3>
                      <p className="text-gray-300">
                        Goma
                        <br />
                        {locale === 'fr' ? 'République Démocratique du Congo' : 'Democratic Republic of Congo'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-brand-red mr-4 mt-1">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{t('info.phone')}</h3>
                      <a href="tel:+243980244431" className="text-gray-300 hover:text-brand-red transition-colors">
                        +243 980 244 431
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-brand-red mr-4 mt-1">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{t('info.email')}</h3>
                      <a href="mailto:info@wote-space.com" className="text-gray-300 hover:text-brand-red transition-colors">
                        info@wote-space.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-brand-red mr-4 mt-1">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{t('info.hours')}</h3>
                      <p className="text-gray-300">
                        {locale === 'fr' ? 'Lundi - Vendredi' : 'Monday - Friday'}: 8:00 - 20:00
                        <br />
                        {locale === 'fr' ? 'Samedi - Dimanche' : 'Saturday - Sunday'}: 9:00 - 18:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-brand-black-light border border-brand-black-light rounded-sm p-4">
                <div className="aspect-video bg-brand-black rounded-sm flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-brand-red mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-400">
                      {locale === 'fr' ? 'Goma, RDC' : 'Goma, DRC'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
