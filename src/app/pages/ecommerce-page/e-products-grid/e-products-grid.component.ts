import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-e-products-grid',
    imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, RouterLink, NgFor, NgIf, NgClass],
    templateUrl: './e-products-grid.component.html',
    styleUrl: './e-products-grid.component.scss'
})
export class EProductsGridComponent implements OnInit, OnDestroy {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly router = inject(Router);
    private clockIntervalId?: ReturnType<typeof setInterval>;

    greeting = '';
    formattedDate = '';
    formattedTime = '';
    greetingIcon = 'ri-sun-line';

    readonly adminProfile = {
        name: 'Priya Narayanan',
        role: 'Global Operations Lead',
        focus: 'USA · India'
    };

    readonly heroInsights = [
        { label: 'Deals live', value: 182, caption: '112 USA · 70 India' },
        { label: 'Awaiting curation', value: 14, caption: 'Needs copy + QA eyes' },
        { label: 'Shoppers in funnel', value: '128K', caption: 'Realtime watchers across channels' },
        { label: 'Revenue today', value: '$24.8K', caption: '18% vs yesterday' },
        { label: 'Active merchants', value: 47, caption: '32 boutique · 15 Amazon' },
        { label: 'Conversion rate', value: '3.2%', caption: 'Up 0.4% this week' }
    ];

    readonly heroFocus = [
        { title: 'Boutique runway', detail: '8 new designers prepping lookbooks' },
        { title: 'Amazon lightning sync', detail: 'Runs again in 12 minutes' },
        { title: 'Subscriber streak', detail: '11 days of net growth' }
    ];

    readonly pipelineStages = [
        { stage: 'Captured', count: 118, detail: 'API + CSV imports last 24h', badge: '+22 vs avg', status: 'healthy' },
        { stage: 'Curated', count: 47, detail: 'Needs copy polish & tags', badge: 'SLA 1.5h', status: 'attention' },
        { stage: 'Approved', count: 26, detail: 'Ready for scheduling', badge: 'Push to publish', status: 'healthy' },
        { stage: 'Published', count: 182, detail: 'Live across experiences', badge: '72 featured', status: 'healthy' }
    ];

    readonly coverageGaps = [
        { category: 'Beauty & Wellness', coverage: '32 live / 4 pending', gap: 'Need vegan kits for India', status: 'attention' },
        { category: 'Fashion & Sarees', coverage: '58 live / 6 pending', gap: 'Plus-size edit missing', status: 'watch' },
        { category: 'Home & Living', coverage: '44 live / 2 pending', gap: 'Seasonal decor low for USA', status: 'healthy' },
        { category: 'Electronics & Gadgets', coverage: '48 live / 1 pending', gap: 'Track Apple resellers', status: 'healthy' }
    ];

    readonly automationWorkflows = [
        { name: 'Amazon lightning catcher', description: 'Ingest hourly lightning + promo codes', active: true, lastRun: '5 mins ago', owner: 'Automation' },
        { name: 'Boutique spotlight drops', description: 'Auto-publish curated boutique looks', active: false, lastRun: 'Paused · needs QA', owner: 'Curation' },
        { name: 'GA4 watcher stream', description: 'Stream realtime watchers into ops', active: true, lastRun: 'Live', owner: 'Data' },
        { name: 'Push surge orchestrator', description: 'Multi-region notification bursts', active: true, lastRun: 'Queued 4 PM IST', owner: 'Lifecycle' }
    ];

    readonly liveSignals = [
        { timestamp: '10:12 AM', severity: 'high', summary: 'GA4 watcher dip (India mobile)', detail: '-19% vs hourly baseline' },
        { timestamp: '9:55 AM', severity: 'medium', summary: 'Boutique Shopify token expiring', detail: '3 stores due in < 24h' },
        { timestamp: '9:20 AM', severity: 'low', summary: 'Push retries elevated in EU', detail: 'Investigating Firebase channel' },
        { timestamp: '8:45 AM', severity: 'medium', summary: 'Amazon API rate limit warning', detail: '85% of quota used today' }
    ];

    readonly merchantCareQueue = [
        { merchant: 'Sakhi Fashion House', need: 'Campaign art approval', owner: 'Creative Studio', due: 'Today · 3 PM', sentiment: 'attention' },
        { merchant: 'Maya Homes', need: 'Inventory feed restart', owner: 'Tech Ops', due: 'Today · 6 PM', sentiment: 'critical' },
        { merchant: 'Anaya’s Closet', need: 'Influencer kit tracking', owner: 'Marketing', due: 'Tomorrow · 10 AM', sentiment: 'watch' }
    ];

    readonly opsChecklist = [
        { task: 'QA boutique onboarding packets', squad: 'Curation', due: '11:00 AM', status: 'in-progress' },
        { task: 'Re-score US Amazon cashback tiers', squad: 'Deals Ops', due: '2:30 PM', status: 'pending' },
        { task: 'Publish SMS nurture path', squad: 'Lifecycle', due: 'EOD', status: 'blocked' }
    ];

    readonly googleAnalytics = [
        { metric: 'Page Views', value: '45.2K', change: '+12%', trend: 'up', period: 'Today' },
        { metric: 'Unique Visitors', value: '18.7K', change: '+8%', trend: 'up', period: 'Today' },
        { metric: 'Total Clicks', value: '156.8K', change: '+15%', trend: 'up', period: 'Today' },
        { metric: 'Avg Session Duration', value: '4m 32s', change: '+18%', trend: 'up', period: 'Today' },
        { metric: 'Pages per Session', value: '2.4', change: '+6%', trend: 'up', period: 'Today' },
        { metric: 'Bounce Rate', value: '32%', change: '-5%', trend: 'down', period: 'Today' },
        { metric: 'New vs Returning', value: '68% new', change: '+3%', trend: 'up', period: 'Today' },
        { metric: 'Conversion Rate', value: '3.2%', change: '+0.4%', trend: 'up', period: 'Today' }
    ];

    readonly topPages = [
        { page: '/deals/beauty-skincare', views: '8.2K', bounce: '28%', time: '5m 12s' },
        { page: '/deals/fashion-sarees', views: '6.9K', bounce: '31%', time: '4m 45s' },
        { page: '/deals/home-living', views: '5.4K', bounce: '35%', time: '3m 28s' },
        { page: '/deals/electronics', views: '4.1K', bounce: '38%', time: '2m 55s' }
    ];

    readonly trafficSources = [
        { source: 'Organic Search', sessions: '12.4K', percentage: '45%', change: '+15%' },
        { source: 'Direct', sessions: '8.7K', percentage: '32%', change: '+8%' },
        { source: 'Social Media', sessions: '3.2K', percentage: '12%', change: '+22%' },
        { source: 'Email', sessions: '2.8K', percentage: '11%', change: '-3%' }
    ];

    readonly systemHealth = [
        { component: 'API Gateway', uptime: '99.98%', status: 'healthy', lastIssue: 'None' },
        { component: 'Database', uptime: '99.95%', status: 'healthy', lastIssue: '2h ago' },
        { component: 'CDN', uptime: '99.99%', status: 'healthy', lastIssue: 'None' },
        { component: 'Payment Processor', uptime: '99.92%', status: 'warning', lastIssue: '4h ago' }
    ];

    readonly feedbackItems = [
        { user: 'Priya S.', rating: 5, comment: 'Amazing deals on sarees! Found exactly what I needed.', time: '2h ago', category: 'positive', read: false },
        { user: 'Anjali M.', rating: 4, comment: 'Good selection but delivery took longer than expected.', time: '4h ago', category: 'neutral', read: false },
        { user: 'Kavita R.', rating: 5, comment: 'Love the boutique partnerships. Quality is excellent!', time: '6h ago', category: 'positive', read: false },
        { user: 'Meera K.', rating: 3, comment: 'More size options needed for plus-size customers.', time: '8h ago', category: 'suggestion', read: false }
    ];

    readonly newRequests = [
        { type: 'Merchant Onboarding', merchant: 'Ritu Collections', status: 'pending', priority: 'high', submitted: '1h ago' },
        { type: 'Deal Submission', merchant: 'Maya Boutique', status: 'under_review', priority: 'medium', submitted: '3h ago' },
        { type: 'Category Addition', merchant: 'Anaya\'s Store', status: 'approved', priority: 'low', submitted: '5h ago' },
        { type: 'Payment Issue', merchant: 'Sakhi Fashion', status: 'in_progress', priority: 'high', submitted: '6h ago' }
    ];

    readonly quickLinks = [
        { label: 'Deal pipeline board', description: 'Prioritize capture → publish flow', route: '/deals-list' },
        { label: 'Merchants & payouts', description: 'Health, contracts, payouts', route: '/pages/ecommerce-page' },
        { label: 'Audience studio', description: 'Email/SMS segments & journeys', route: '/apps/email-marketing' },
        { label: 'Automation cockpit', description: 'Rules, toggles, alerting', route: '/settings/automation' }
    ];

    ngOnInit(): void {
        this.updateClock();
        if (isPlatformBrowser(this.platformId)) {
            this.clockIntervalId = setInterval(() => this.updateClock(), 60_000);
        }
    }

    ngOnDestroy(): void {
        if (this.clockIntervalId) {
            clearInterval(this.clockIntervalId);
        }
    }

    private updateClock(): void {
        const now = new Date();
        this.formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        this.formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const greetingData = this.getGreeting(now.getHours());
        this.greeting = greetingData.greeting;
        this.greetingIcon = greetingData.icon;
    }

    private getGreeting(hour: number): { greeting: string; icon: string } {
        if (hour < 6) {
            return { greeting: 'Good night', icon: 'ri-moon-line' };
        }
        if (hour < 12) {
            return { greeting: 'Good morning', icon: 'ri-sun-line' };
        }
        if (hour < 17) {
            return { greeting: 'Good afternoon', icon: 'ri-sun-line' };
        }
        if (hour < 21) {
            return { greeting: 'Good evening', icon: 'ri-moon-line' };
        }
        return { greeting: 'Good night', icon: 'ri-moon-line' };
    }

    // Action handlers
    onPostDeal(): void {
        console.log('Navigate to post deal page');
        this.router.navigate(['/admin/post-deal']);
    }

    onWebsiteMessage(): void {
        console.log('Navigate to website message page');
        // Add navigation logic here
    }

    onSettings(): void {
        console.log('Navigate to settings page');
        // Add navigation logic here
    }

    onAddMerchant(): void {
        console.log('Navigate to add merchant page');
        // Add navigation logic here
    }

    onAnalyticsReport(): void {
        console.log('Navigate to analytics report page');
        // Add navigation logic here
    }

    onSendNotification(): void {
        console.log('Navigate to send notification page');
        // Add navigation logic here
    }

    // Ripple effect handler
    onActionClick(event: Event, action: string): void {
        const card = event.currentTarget as HTMLElement;
        card.classList.add('clicked');

        // Remove the class after animation completes
        setTimeout(() => {
            card.classList.remove('clicked');
        }, 600);

        // Call the appropriate action handler
        switch (action) {
            case 'post-deal':
                this.onPostDeal();
                break;
            case 'website-message':
                this.onWebsiteMessage();
                break;
            case 'settings':
                this.onSettings();
                break;
            case 'add-merchant':
                this.onAddMerchant();
                break;
            case 'analytics-report':
                this.onAnalyticsReport();
                break;
            case 'send-notification':
                this.onSendNotification();
                break;
        }
    }

    // Feedback and Request action handlers
    onFeedbackAction(action: string, feedback: any, index: number): void {
        switch (action) {
            case 'view':
                console.log('View feedback details:', feedback);
                // Add navigation to feedback details modal/page
                break;
            case 'mark-read':
                console.log('Mark feedback as read:', feedback);
                // Toggle read status
                feedback.read = !feedback.read;
                break;
            case 'delete':
                console.log('Delete feedback:', feedback);
                // Remove feedback from array
                this.feedbackItems.splice(index, 1);
                break;
        }
    }

    onRequestAction(action: string, request: any, index: number): void {
        switch (action) {
            case 'view':
                console.log('View request details:', request);
                // Add navigation to request details modal/page
                break;
            case 'change-status':
                console.log('Change request status:', request);
                // Cycle through status options
                const statuses = ['pending', 'under_review', 'approved', 'rejected'];
                const currentIndex = statuses.indexOf(request.status);
                request.status = statuses[(currentIndex + 1) % statuses.length];
                break;
            case 'delete':
                console.log('Delete request:', request);
                // Remove request from array
                this.newRequests.splice(index, 1);
                break;
        }
    }
}