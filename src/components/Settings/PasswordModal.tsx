import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updatePassword } from "../../utils/authService";

interface PasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
}

/**
 * Modal component for changing the user's password
 * @param isVisible - Boolean to control the modal visibility
 * @param onClose - Function to close the modal
 */
const PasswordModal: React.FC<PasswordModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);

  /**
   * Handles password change action
   */
  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      if (auth && auth.token && auth.userId) {
        await updatePassword(auth.token, newPassword);
        Alert.alert("Success", "Password updated successfully.");
        onClose();
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        Alert.alert("Error", "User not authenticated.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="gray"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="gray"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={isUpdatingPassword}
        >
          <Text style={[styles.label, styles.clickable, { color: "blue" }]}>
            {isUpdatingPassword ? (
              <ActivityIndicator color="blue" />
            ) : (
              "Update Password"
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Text style={[styles.label, styles.clickable, { color: "red" }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Styles for the PasswordModal component
const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f9beda",
    color: "black",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  clickable: {
    textDecorationLine: "underline",
  },
});

export default PasswordModal;
