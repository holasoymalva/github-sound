/**
 * Obtiene las contribuciones del último año de un usuario de GitHub
 * Usa GitHub Contributions API (scraping via proxy)
 */
export async function getGitHubContributions(username) {
    try {
        // Usar API de GitHub Contributions (servicio público)
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        
        if (!response.ok) {
            throw new Error('Usuario no encontrado o error al obtener datos');
        }

        const data = await response.json();
        return parseContributionsData(data);
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}

function parseContributionsData(data) {
    const contributions = [];
    let total = data.total.lastYear || 0;

    // La API devuelve contributions como array de objetos con fecha y count
    data.contributions.forEach(contribution => {
        contributions.push({
            date: contribution.date,
            count: contribution.count
        });
    });

    return {
        total,
        contributions,
        activeDays: contributions.filter(d => d.count > 0).length
    };
}
