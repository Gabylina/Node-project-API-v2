/* migrated from app/Http/Middleware/EnsureProjectOwner.php */
export function EnsureProjectOwner(req, res, next) {

import { ProjectService } from '../services/projectService.js'; // Adjust path as per your project structure

export async function EnsureProjectOwner(req, res, next) {
    try {
        const projectId = req.params.project;

        if (!projectId) {
            // If the route parameter 'project' is missing, it's a bad request.
            return res.status(400).json({ error: 'Project ID is missing from route parameters.' });
        }

        const project = await ProjectService.findById(projectId);

        if (!project) {
            // Corresponds to Laravel's findOrFail throwing ModelNotFoundException
            return res.status(404).json({ error: 'Project not found.' });
        }

        // Ensure the authenticated user object is available (typically from an auth middleware)
        if (!req.user || !req.user.id) {
            // This case indicates that authentication middleware might not have run or failed.
            return res.status(401).json({ error: 'Authentication required.' });
        }

        if (project.user_id !== req.user.id) {
            // Corresponds to Laravel's abort(403, 'No autorizado.')
            return res.status(403).json({ error: 'No autorizado.' });
        }

        // Attach the project object to the request for subsequent middleware or route handlers
        req.project = project;

        next();
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error in EnsureProjectOwner middleware:', error);
        // Return a generic server error for any unexpected issues (e.g., database connection errors)
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

}

export default { EnsureProjectOwner };