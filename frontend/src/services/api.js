// BloodLink LK - Backend API Client Service

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5128';

/**
 * Custom error class capturing backend HTTP response details
 */
export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch wrapper with JSON handling and detailed error extraction
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);

    // Read response body as JSON or text
    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const errorMsg =
        (typeof data === 'object' && data?.message) ||
        (typeof data === 'string' && data) ||
        `Request failed with status ${res.status}`;
      throw new ApiError(res.status, errorMsg, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network errors (e.g. backend down or CORS blocked)
    console.error(`API request error on ${url}:`, err);
    throw new ApiError(0, 'Unable to connect to the BloodLink LK backend server. Please ensure the backend is running.', err);
  }
}

// -------------------------------------------------------------
// Authentication Endpoints (/api/Auth)
// -------------------------------------------------------------
export const authApi = {
  /**
   * Register a new user (Donor or Requester)
   * @param {Object} dto - { fullName, email, password, contactNumber, role, bloodGroup?, location?, description? }
   */
  async register(dto) {
    return await request('/api/Auth/register', {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  },

  /**
   * Login with email and password
   * @param {Object} credentials - { email, password }
   */
  async login({ email, password }) {
    return await request('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }
};

// -------------------------------------------------------------
// Blood Requests Endpoints (/api/BloodRequests)
// -------------------------------------------------------------
export const requestsApi = {
  /**
   * Get all blood requests
   */
  async getAll() {
    const data = await request('/api/BloodRequests');
    return Array.isArray(data) ? data.map(normalizeRequest) : [];
  },

  /**
   * Get a single blood request by ID
   */
  async getById(id) {
    const data = await request(`/api/BloodRequests/${id}`);
    return normalizeRequest(data);
  },

  /**
   * Create a standard blood request (Normal or High urgency)
   */
  async create(dto) {
    const data = await request('/api/BloodRequests', {
      method: 'POST',
      body: JSON.stringify(dto)
    });
    return normalizeRequest(data);
  },

  /**
   * Create an emergency blood request
   */
  async createEmergency(dto) {
    const data = await request('/api/BloodRequests/emergency', {
      method: 'POST',
      body: JSON.stringify(dto)
    });
    return normalizeRequest(data);
  },

  /**
   * Update the status of a blood request (Active, Matched, Fulfilled, Cancelled)
   */
  async updateStatus(id, status) {
    return await request(`/api/BloodRequests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  /**
   * Get compatible donors in the same location for a blood request
   */
  async getCompatibleDonors(id) {
    const res = await request(`/api/BloodRequests/${id}/compatible-donors`);
    return {
      request: normalizeRequest(res.request),
      compatibleBloodGroups: res.compatibleBloodGroups || [],
      donors: (res.donors || []).map(normalizeDonor)
    };
  },

  /**
   * Get compatible donors across all locations for a blood request
   */
  async getCompatibleDonorsAllLocations(id) {
    const res = await request(`/api/BloodRequests/${id}/compatible-donors/all-locations`);
    return {
      request: normalizeRequest(res.request),
      compatibleBloodGroups: res.compatibleBloodGroups || [],
      donors: (res.donors || []).map(normalizeDonor)
    };
  }
};

// -------------------------------------------------------------
// Donors Endpoints (/api/Donors)
// -------------------------------------------------------------
export const donorsApi = {
  /**
   * Get available donors with optional blood group and location filters
   */
  async getAll({ bloodGroup, location } = {}) {
    const params = new URLSearchParams();
    if (bloodGroup && bloodGroup !== 'ALL') {
      params.append('bloodGroup', bloodGroup);
    }
    if (location && location !== 'ALL') {
      params.append('location', location);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const data = await request(`/api/Donors${queryString}`);
    return Array.isArray(data) ? data.map(normalizeDonor) : [];
  },

  /**
   * Get a single donor by ID
   */
  async getById(id) {
    const data = await request(`/api/Donors/${id}`);
    return normalizeDonor(data);
  },

  /**
   * Update donor availability (true / false)
   */
  async updateAvailability(id, isAvailable) {
    return await request(`/api/Donors/${id}/availability`, {
      method: 'PUT',
      body: JSON.stringify(Boolean(isAvailable))
    });
  },

  /**
   * Delete a donor profile
   */
  async delete(id) {
    return await request(`/api/Donors/${id}`, {
      method: 'DELETE'
    });
  }
};

// -------------------------------------------------------------
// Normalization Utilities for seamless frontend UI consumption
// -------------------------------------------------------------

export function normalizeRequest(req) {
  if (!req) return req;
  const deadlineDate = req.deadline ? new Date(req.deadline).toISOString().split('T')[0] : '';
  const createdDate = req.createdAt ? new Date(req.createdAt).toISOString().replace('T', ' ').substring(0, 16) : '';

  // Extract units if specified in description or default to 1
  let units = 1;
  const unitMatch = req.description?.match(/(\d+)\s*(?:unit|pint|bag)/i);
  if (unitMatch) {
    units = parseInt(unitMatch[1], 10);
  }

  // Extract hospital from description or fallback to location
  let hospital = req.location ? `${req.location} General Hospital` : 'Hospital Not Specified';
  const hospMatch = req.description?.match(/Hospital:\s*([^\n;.]+)/i);
  if (hospMatch) {
    hospital = hospMatch[1].trim();
  }

  return {
    ...req,
    id: req.id,
    RequestNumber: req.requestNumber || req.RequestNumber || `BL-${req.id}`,
    requestNumber: req.requestNumber || req.RequestNumber || `BL-${req.id}`,
    name: req.requesterName || req.name || 'Valued Requester',
    requesterName: req.requesterName || req.name || 'Valued Requester',
    BloodGroup: req.bloodGroup || req.BloodGroup || '',
    bloodGroup: req.bloodGroup || req.BloodGroup || '',
    Location: req.location || req.Location || '',
    location: req.location || req.Location || '',
    Hospital: hospital,
    hospital: hospital,
    UnitsRequired: units,
    unitsRequired: units,
    Urgency: req.urgency || req.Urgency || 'Normal',
    urgency: req.urgency || req.Urgency || 'Normal',
    Status: req.status || req.Status || 'Active',
    status: req.status || req.Status || 'Active',
    ContactNumber: req.contactNumber || req.ContactNumber || '',
    contactNumber: req.contactNumber || req.ContactNumber || '',
    RequiredDate: deadlineDate || req.RequiredDate || '',
    deadline: req.deadline,
    Description: req.description || req.Description || '',
    description: req.description || req.Description || '',
    CreatedAt: createdDate || req.CreatedAt || '',
    createdAt: req.createdAt,
    IsEmergency: Boolean(req.isEmergency || req.urgency === 'Emergency')
  };
}

export function normalizeDonor(donor) {
  if (!donor) return donor;
  const createdDate = donor.createdAt ? new Date(donor.createdAt).toISOString().split('T')[0] : '';
  return {
    ...donor,
    id: donor.id,
    userId: donor.userId,
    name: donor.name || 'Voluntary Donor',
    BloodGroup: donor.bloodGroup || donor.BloodGroup || '',
    bloodGroup: donor.bloodGroup || donor.BloodGroup || '',
    Location: donor.location || donor.Location || '',
    location: donor.location || donor.Location || '',
    ContactNumber: donor.contactNumber || donor.ContactNumber || '',
    contactNumber: donor.contactNumber || donor.ContactNumber || '',
    description: donor.description || '',
    isAvailable: donor.isAvailable !== false,
    Status: donor.isAvailable ? 'Available' : 'Unavailable',
    AvailableDate: createdDate || 'Today',
    totalDonations: donor.totalDonations || 1
  };
}
