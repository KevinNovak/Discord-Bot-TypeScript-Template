type Theme = {
    label: string;
    description: string;
    value: string;
    emoji: string;
};

export class ThemesListUtils {
    private static themes: Theme[] = [
        // Relations et interactions sociales
        { value: 'relationship', label: 'Relationship', description: 'Concerns about romantic relationships and dating.', emoji: '❤️' },
        { value: 'friendship', label: 'Friendship', description: 'Difficulties or experiences with friends.', emoji: '🤝' },
        { value: 'family', label: 'Family', description: 'Issues and dynamics within the family.', emoji: '👪' },
        { value: 'sexuality', label: 'Sexuality', description: 'Experiences, intimate relationships, and situations related to sexuality.', emoji: '🔥' },
        
        // Santé et bien-être
        { value: 'mental_health', label: 'Mental Health', description: 'Topics related to emotional well-being and mental health.', emoji: '🧠' },
        { value: 'health', label: 'Health', description: 'Physical health, medical concerns, and wellness.', emoji: '🏥' },
        { value: 'addiction', label: 'Addiction', description: 'Struggles with substance use, gambling, or other addictions.', emoji: '⛓️' },
    
        // Travail, finances et éducation
        { value: 'work', label: 'Work/School', description: 'Challenges related to work, career, or education.', emoji: '💼' },
        { value: 'financial', label: 'Financial', description: 'Money management, debt, and financial concerns.', emoji: '💰' },
        { value: 'education', label: 'Education', description: 'Academic challenges, studying, and learning experiences.', emoji: '📚' },
    
        // Loisirs et intérêts personnels
        { value: 'hobbies', label: 'Hobbies', description: 'Interests, creative activities, and personal passions.', emoji: '🎨' },
        { value: 'travel', label: 'Travel', description: 'Experiences, plans, and challenges related to traveling.', emoji: '✈️' },
        { value: 'sports', label: 'Sports', description: 'Topics related to sports, fitness, and athletic activities.', emoji: '⚽' },
        { value: 'technology', label: 'Technology', description: 'Discussions about tech trends, gadgets, and innovations.', emoji: '💻' },
    
        // Société et environnement
        { value: 'environment', label: 'Environment', description: 'Climate change, sustainability, and ecological concerns.', emoji: '🌍' },
    
        // Autres
        { value: 'secret', label: 'Secret', description: 'Confidential matters and hidden truths.', emoji: '🤫' },
        { value: 'other', label: 'Other', description: 'Any topic that does not fit into the listed categories.', emoji: '❓' },
    ];
    
    public static getThemes(): Theme[] {
        return this.themes;
    }

    public static getEmojiyValue(value: string): string | undefined {
        const theme = this.themes.find(theme => theme.value === value);
        return theme ? theme.emoji : undefined;
    }

    public static getLabelByValue(value: string): string | undefined {
        const theme = this.themes.find(theme => theme.value === value);
        return theme ? theme.label : undefined;
    }
}