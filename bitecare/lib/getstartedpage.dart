import 'package:flutter/material.dart';

class GetStartedPage extends StatelessWidget {
  const GetStartedPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xfff8fbfc),
      body: Column(
        children: [
          // Hero Image
          Container(
            height: 240,
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuA4hWYRXrZHtRL3XYkW8mSM5qiWimlYlG-PMZgaq9hSgk7MhQe46gyvBA_-CB1C8Bhy7L8yVA5PNYRt7--52290MZMZtm6RXObM_Sb_4O0SgZCdUfRxw5AlbMK_yue9l5xDNm1NS8fdselk-mqQxK-UhdbcnAktkuTW2Yc4QQSn3ClHREJgYXZzQGO3P-o9yYFKQASDP6Uza2h47eXn9j1hSz76ao_oKykaatAswIIiFtK_TMLYcB58m9oJj9FRkyZqzkUOBNwUWCM',
                ),
                fit: BoxFit.cover,
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Title and description
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              children: [
                Text(
                  'Welcome to PetCare',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0e181b),
                  ),
                ),
                SizedBox(height: 12),
                Text(
                  'Your trusted companion in managing animal bite treatments. Book appointments, receive notifications, and more. Get vaccinated easily through our app.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: Color(0xFF0e181b),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Buttons
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              children: [
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF30bae8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: () {
                      // TODO: Navigate to Register
                    },
                    child: const Text(
                      'Register',
                      style: TextStyle(
                        color: Color(0xFF0e181b),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFe7f0f3),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: () {
                      // TODO: Navigate to Login
                    },
                    child: const Text(
                      'Login',
                      style: TextStyle(
                        color: Color(0xFF0e181b),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const Spacer(),

          // Bottom Navigation Bar
          Container(
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: Color(0xFFe7f0f3))),
              color: Color(0xfff8fbfc),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: const [
                Icon(Icons.home, color: Color(0xFF0e181b)),
                Icon(Icons.calendar_today_outlined, color: Color(0xFF4e8597)),
                Icon(Icons.chat_bubble_outline, color: Color(0xFF4e8597)),
                Icon(Icons.person_outline, color: Color(0xFF4e8597)),
              ],
            ),
          ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }
}
