/**
 * Interface for campus filter options
 */
export interface CampusFilterOptions {
  name?: string;
  address?: string;
}

/**
 * Interface for campus data
 */
export interface Campus {
  id: number;
  name: string;
  address: string | null;
}
