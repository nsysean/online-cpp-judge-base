#include <bits/stdc++.h>
using namespace std;
int main() {
  int t;
  cin >> t;
  while (t--) {
    int n, v, k=0;
    cin >> n >> v;
    int arr[n];
    for (int i=0; i<n; i++) cin >> arr[i];
    sort(arr, arr + n);
    for (int i=n-1; i>=0; i--) {
      if(v < n-1) {
        v += arr[i], k++;
      }
    }
    cout << k << '\n';
  }
}