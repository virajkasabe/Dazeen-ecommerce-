import React from 'react';
import { cn } from '../../lib/utils';
import {
	LucideIcon,
	PlusIcon,
} from 'lucide-react';

type ContactInfoProps = React.ComponentProps<'div'> & {
	icon: LucideIcon;
	label: string;
	value: string;
};

type ContactCardProps = React.ComponentProps<'div'> & {
	// Content props
	title?: string;
	description?: string;
	contactInfo?: ContactInfoProps[];
	formSectionClassName?: string;
};

export function ContactCard({
	title = 'Contact With Us',
	description = 'If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day.',
	contactInfo,
	className,
	formSectionClassName,
	children,
	...props
}: ContactCardProps) {
	return (
		<div
			className={cn(
				'bg-stone-950 border border-stone-800/80 relative grid h-full w-full shadow-2xl rounded-3xl overflow-hidden md:grid-cols-2 lg:grid-cols-3 text-stone-100',
				className,
			)}
			{...props}
		>
			<PlusIcon className="absolute -top-3 -left-3 h-6 w-6 text-stone-600 pointer-events-none" />
			<PlusIcon className="absolute -top-3 -right-3 h-6 w-6 text-stone-600 pointer-events-none" />
			<PlusIcon className="absolute -bottom-3 -left-3 h-6 w-6 text-stone-600 pointer-events-none" />
			<PlusIcon className="absolute -right-3 -bottom-3 h-6 w-6 text-stone-600 pointer-events-none" />
			
			<div className="flex flex-col justify-between lg:col-span-2">
				<div className="relative h-full space-y-6 px-6 py-10 md:p-10">
					<h1 className="text-3xl font-serif font-black md:text-4xl lg:text-5xl text-stone-50 tracking-tight">
						{title}
					</h1>
					<p className="text-stone-400 max-w-xl text-sm md:text-base leading-relaxed">
						{description}
					</p>
					<div className="grid gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 pt-4">
						{contactInfo?.map((info, index) => (
							<ContactInfo key={index} {...info} />
						))}
					</div>
				</div>
			</div>
			
			<div
				className={cn(
					'bg-stone-900/40 backdrop-blur-md flex h-full w-full items-center border-t border-stone-800/80 p-6 md:col-span-1 md:border-t-0 md:border-l',
					formSectionClassName,
				)}
			>
				{children}
			</div>
		</div>
	);
}

function ContactInfo({
	icon: Icon,
	label,
	value,
	className,
	...props
}: ContactInfoProps) {
	return (
		<div className={cn('flex items-center gap-3.5 py-3', className)} {...props}>
			<div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3 text-amber-400">
				<Icon className="h-5 w-5" />
			</div>
			<div>
				<p className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400">{label}</p>
				<p className="text-stone-100 text-sm font-semibold mt-0.5">{value}</p>
			</div>
		</div>
	);
}
