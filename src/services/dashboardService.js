import { getAllUsers } from './userService';
import { getAllRestaurants, getPendingRestaurants } from './restaurantService';
import { getAllDeliveryPersons, getPendingDeliveryPersons } from './deliveryPersonService';
import { getAllComplaints, getNewComplaints } from './complaintService';
import { getAllReviews } from './reviewService';

// Get Dashboard Stats by calling multiple APIs
export async function getDashboardStats() {
  try {
    // Fetch all data in parallel
    const [
      allUsersPage,
      customersPage,
      restaurantOwnersPage,
      deliveryPersonsUserPage,
      allRestaurantsPage,
      pendingRestaurants,
      allDeliveryPersonsPage,
      pendingDeliveryPersons,
      newComplaints,
      allComplaintsPage,
      allReviewsPage,
    ] = await Promise.allSettled([
      getAllUsers(0, 1), // Just to get total count
      getAllUsers(0, 1, 'customer'),
      getAllUsers(0, 1, 'restaurant_owner'),
      getAllUsers(0, 1, 'delivery_person'),
      getAllRestaurants(0, 1), // Just to get total count
      getPendingRestaurants(),
      getAllDeliveryPersons(0, 1),
      getPendingDeliveryPersons(0, 100), // Get all pending
      getNewComplaints(),
      getAllComplaints(0, 1),
      getAllReviews(0, 1),
    ]);

    // Helper to safely get value from settled promise
    const getValue = (result) => result.status === 'fulfilled' ? result.value : null;

    const allUsers = getValue(allUsersPage);
    const customers = getValue(customersPage);
    const restaurantOwners = getValue(restaurantOwnersPage);
    const deliveryPersonsUsers = getValue(deliveryPersonsUserPage);
    const restaurants = getValue(allRestaurantsPage);
    const pendingRest = getValue(pendingRestaurants);
    const deliveryPersons = getValue(allDeliveryPersonsPage);
    const pendingDP = getValue(pendingDeliveryPersons);
    const newComp = getValue(newComplaints);
    const allComp = getValue(allComplaintsPage);
    const reviews = getValue(allReviewsPage);

    return {
      // Users
      totalUsers: allUsers?.totalElements || 0,
      totalCustomers: customers?.totalElements || 0,
      totalRestaurantOwners: restaurantOwners?.totalElements || 0,
      totalDeliveryPersonsUsers: deliveryPersonsUsers?.totalElements || 0,
      
      // Restaurants
      totalRestaurants: restaurants?.totalElements || 0,
      pendingRestaurants: Array.isArray(pendingRest) ? pendingRest.length : 0,
      
      // Delivery Persons
      totalDeliveryPersons: deliveryPersons?.totalElements || 0,
      pendingDeliveryPersons: Array.isArray(pendingDP) ? pendingDP.length : 0,
      
      // Complaints
      totalComplaints: allComp?.totalElements || 0,
      newComplaints: Array.isArray(newComp) ? newComp.length : 0,
      
      // Reviews
      totalReviews: reviews?.totalElements || 0,
      
      // These will be 0 for now (you can add orders APIs later)
      totalOrders: 0,
      todayRevenue: 0,
      activeDeliveries: 0,
      deliveredToday: 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values instead of throwing
    return {
      totalUsers: 0,
      totalCustomers: 0,
      totalRestaurantOwners: 0,
      totalDeliveryPersonsUsers: 0,
      totalRestaurants: 0,
      pendingRestaurants: 0,
      totalDeliveryPersons: 0,
      pendingDeliveryPersons: 0,
      totalComplaints: 0,
      newComplaints: 0,
      totalReviews: 0,
      totalOrders: 0,
      todayRevenue: 0,
      activeDeliveries: 0,
      deliveredToday: 0,
    };
  }
}

// Export the other functions for reuse
export { getPendingRestaurants, getPendingDeliveryPersons, getNewComplaints };