// lib/date.ts

/**
 * Shared utility to format ISO date strings into clean, human-readable en-US format.
 * Protected against Server-Side Rendering (SSR) Hydration Mismatch and Invalid Date exceptions.
 */
export function formatDate(date: string | Date | null | undefined): string {
    // 1. الفحص الوقائي: حماية الحاوية من تكسر الرندرة في حال غياب حقل التاريخ بالكامل
    if (!date) return "[ Timestamp Missing ]";

    try {
        const parsedDate = new Date(date);

        // 2. الفحص الأمني الصارم: التحقق من صحة الصيغة لعدم طباعة "Invalid Date" المشوهة أمام العامة
        if (isNaN(parsedDate.getTime())) {
            return "[ Invalid Timestamp Node ]";
        }

        // 3. التنسيق القياسي التفاعلي المتوافق مع شاشات ومؤشرات العرض لـ Workora
        return parsedDate.toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "short",
        });
    } catch (error) {
        console.error("Critical: Shared date utility execution exception intercepted:", error);
        return "[ Time Sync Exception ]";
    }
}
