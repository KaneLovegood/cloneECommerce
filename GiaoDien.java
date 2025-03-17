package iuh.fit;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.Serializable;
import java.util.ArrayList;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.table.DefaultTableModel;

public class GiaoDien extends JFrame implements Serializable, ActionListener, MouseListener {
	private static final long serialVersionUID = 1L;
	private final JButton btnThem;
	private final JButton btnSua;
	private final JButton btnXoa;
	private final JButton btnLuu;
	private final JButton btnXoaRong;
	private final JTextField txtMaSach;
	private final JTextField txtTenSach;
	private final JTextField txtTacGia;
	private final JTextField txtNamXuatBan;
	private final JTextField txtNhaXuatBan;
	private final JTextField txtSoTrang;
	private final JTextField txtDonGia;
	private final JTextField txtISBN;
	private final DefaultTableModel model;
	private final JTable table;
	private final ArrayList<Sach> listSach;
	private JComboBox<String> comboBoxMaSach;

	public GiaoDien() {
		setTitle("Quản lý sách");
		setSize(900, 600);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setLocationRelativeTo(null);

		JPanel panelNoiDung = new JPanel();
		panelNoiDung.setLayout(new BorderLayout());

		JPanel panelInput = new JPanel(new GridLayout(0, 4, 10, 10));
		JLabel lblMaSach = new JLabel("Mã sách:");
		JLabel lblTenSach = new JLabel("Tựa sách:");
		JLabel lblTacGia = new JLabel("Tác giả:");
		JLabel lblNamXuatBan = new JLabel("Năm xuất bản:");
		JLabel lblNhaXuatBan = new JLabel("Nhà xuất bản:");
		JLabel lblSoTrang = new JLabel("Số trang:");
		JLabel lblDonGia = new JLabel("Đơn giá:");
		JLabel lblISBN = new JLabel("International Standard Book Number:");
		txtMaSach = new JTextField(20);
		txtTenSach = new JTextField(20);
		txtTacGia = new JTextField(20);
		txtNamXuatBan = new JTextField(20);
		txtNhaXuatBan = new JTextField(20);
		txtSoTrang = new JTextField(20);
		txtDonGia = new JTextField(20);
		txtISBN = new JTextField(20);

		panelInput.add(lblMaSach);
		panelInput.add(txtMaSach);
		panelInput.add(lblTacGia);
		panelInput.add(txtTacGia);
		panelInput.add(lblTenSach);
		panelInput.add(txtTenSach);
		panelInput.add(lblNhaXuatBan);
		panelInput.add(txtNhaXuatBan);
		panelInput.add(lblNamXuatBan);
		panelInput.add(txtNamXuatBan);
		panelInput.add(lblDonGia);
		panelInput.add(txtDonGia);
		panelInput.add(lblSoTrang);
		panelInput.add(txtSoTrang);
		panelInput.add(lblISBN);
		panelInput.add(txtISBN);

		panelInput.setBorder(BorderFactory.createTitledBorder("Record Editor"));

		JPanel panelButton = new JPanel();
		btnThem = new JButton("Thêm");
		btnSua = new JButton("Sửa");
		btnXoa = new JButton("Xóa");
		btnLuu = new JButton("Lưu");
		btnXoaRong = new JButton("Xoá rỗng");

		JLabel lblTimKiem = new JLabel("Tìm theo mã sách:");
		comboBoxMaSach = new JComboBox<>();

		panelButton.add(btnThem);
		panelButton.add(btnXoaRong);
		panelButton.add(btnXoa);
		panelButton.add(btnSua);
		panelButton.add(btnLuu);
		panelButton.add(lblTimKiem);
		panelButton.add(comboBoxMaSach);

		listSach = new ArrayList<>();

		// doc du lieu tu file data.txt

		table = new JTable();
		model = new DefaultTableModel();
		model.addColumn("Mã sách");
		model.addColumn("Tựa sách");
		model.addColumn("Tác giả");
		model.addColumn("Nhà xuất bản");
		model.addColumn("Năm xuất bản");
		model.addColumn("Số trang");
		model.addColumn("Đơn giá");
		model.addColumn("ISBN");

		BufferedReader br = null;
		try {
			br = new BufferedReader(new FileReader("data.txt"));
			String line;
			br.readLine();
			while ((line = br.readLine()) != null) {
				String[] data = line.split(";");
				Sach sach = new Sach(data[0], data[1], data[2], Integer.parseInt(data[3]), data[4],
						Integer.parseInt(data[5]), Double.parseDouble(data[6]), data[7]);
				listSach.add(sach);
				model.addRow(new Object[] { data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7] });
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				br.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		table.setModel(model);

		// khong cho sua

		table.setDefaultEditor(Object.class, null);

		JScrollPane scrollPane = new JScrollPane(table);

		JPanel panelNorth = new JPanel();
		panelNorth.setLayout(new BorderLayout());
		panelNorth.add(panelInput, BorderLayout.CENTER);
		panelNorth.add(panelButton, BorderLayout.SOUTH);

		panelNoiDung.add(panelNorth, BorderLayout.NORTH);

		panelNoiDung.add(scrollPane, BorderLayout.CENTER);
		add(panelNoiDung);
		setVisible(true);
		
		for (Sach s : listSach) {
			comboBoxMaSach.addItem(s.getMaSach());
		}
		comboBoxMaSach.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				locTheoMaSach();
			}
		});

		btnThem.addActionListener(this);
		table.addMouseListener(this);
		btnXoaRong.addActionListener(this);
		btnXoa.addActionListener(this);
		btnSua.addActionListener(this);
		btnLuu.addActionListener(this);
	}

	public static void main(String[] args) {
		new GiaoDien();
	}

	@Override
	public void actionPerformed(ActionEvent e) {

		Object o = e.getSource();
		if (o.equals(btnThem)) {
			String maSach = txtMaSach.getText();
			String tuaSach = txtTenSach.getText();
			String tacGia = txtTacGia.getText();
			int namXuatBan = txtNamXuatBan.getText().isEmpty() ? 0 : Integer.parseInt(txtNamXuatBan.getText());
			String nhaXuatBan = txtNhaXuatBan.getText();
			int soTrang = txtSoTrang.getText().isEmpty() ? 0 : Integer.parseInt(txtSoTrang.getText());
			double donGia = txtDonGia.getText().isEmpty() ? 0 : Double.parseDouble(txtDonGia.getText());
			String isbn = txtISBN.getText();

			// Kiểm tra mã sách
			if (maSach.isEmpty() || !maSach.matches("^[A-Z]\\d{3}$")) {
				JOptionPane.showMessageDialog(this, "Mã sách không hợp lệ.");
				return;
			}
			for (Sach s : listSach) {
				if (s.getMaSach().equals(maSach)) {
					JOptionPane.showMessageDialog(this, "Mã sách đã tồn tại.");
					return;
				}
			}

			// Kiểm tra tựa sách
			if (tuaSach.isEmpty() || !tuaSach.matches("^[\\w\\s\\-()]+$")) {
				JOptionPane.showMessageDialog(this, "Tựa sách không hợp lệ.");
				return;
			}

			// Kiểm tra tác giả
			if (tacGia.isEmpty() || !tacGia.matches("^[\\p{L}\\s']+$")) {
				JOptionPane.showMessageDialog(this, "Tác giả không hợp lệ.");
				return;
			}

			// Kiểm tra năm xuất bản
			int currentYear = java.util.Calendar.getInstance().get(java.util.Calendar.YEAR);
			if (namXuatBan < 1900 || namXuatBan > currentYear) {
				JOptionPane.showMessageDialog(this, "Năm xuất bản không hợp lệ.");
				return;
			}

			// Kiểm tra đơn giá
			if (donGia < 0) {
				JOptionPane.showMessageDialog(this, "Đơn giá không hợp lệ.");
				return;
			}

			// Kiểm tra ISBN
			if (!isbn.matches("^(\\d+-){3,4}\\d+$")) {
				JOptionPane.showMessageDialog(this, "ISBN không hợp lệ.");
				return;
			}

			Sach sach = new Sach(maSach, tuaSach, tacGia, namXuatBan, nhaXuatBan, soTrang, donGia, isbn);
			listSach.add(sach);
			model.addRow(new Object[] { maSach, tuaSach, tacGia, nhaXuatBan, namXuatBan, soTrang, donGia, isbn });

		} else if (o.equals(btnSua)) {
			int index = table.getSelectedRow();
			if (index != -1) {
				model.setValueAt(txtTenSach.getText(), index, 1);
				model.setValueAt(txtTacGia.getText(), index, 2);
				model.setValueAt(txtNhaXuatBan.getText(), index, 3);
				model.setValueAt(Integer.parseInt(txtNamXuatBan.getText()), index, 4);
				model.setValueAt(Integer.parseInt(txtSoTrang.getText()), index, 5);
				model.setValueAt(Double.parseDouble(txtDonGia.getText()), index, 6);
				model.setValueAt(txtISBN.getText(), index, 7);
			}
		} else if (o.equals(btnXoa)) {
			// code here
			int index = table.getSelectedRow();

			model.removeRow(index);

		} else if (o.equals(btnLuu)) {

			BufferedWriter bw = null;

			try {
				bw = new BufferedWriter(new FileWriter("data.txt"));
				bw.write("Mã sách;Tựa sách;Tác giả;Nhà xuất bản;Năm xuất bản;Số trang;Đơn giá;ISBN");
				for (Sach s : listSach) {
					bw.newLine();
					bw.write(s.getMaSach() + ";" + s.getTuaSach() + ";" + s.getTacGia() + ";" + s.getNamXuatBan() + ";"
							+ s.getNhaXuatBan() + ";" + s.getSoTrang() + ";" + s.getDonGia() + ";" + s.getIsbn());
				}
			} catch (Exception ex) {
				ex.printStackTrace();
			} finally {
				try {
					bw.close();
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}

		} else if (o.equals(btnXoaRong)) {
			txtMaSach.setText("");
			txtTenSach.setText("");
			txtTacGia.setText("");
			txtNamXuatBan.setText("");
			txtNhaXuatBan.setText("");
			txtSoTrang.setText("");
			txtDonGia.setText("");
			txtISBN.setText("");
			this.txtMaSach.requestFocus();
		} 
	}

	@Override
	public void mouseClicked(MouseEvent e) {
		int index = table.getSelectedRow();
		this.txtMaSach.setText((String) model.getValueAt(index, 0));
		this.txtTenSach.setText((String) model.getValueAt(index, 1));
		this.txtTacGia.setText((String) model.getValueAt(index, 2));
		this.txtNhaXuatBan.setText((String) model.getValueAt(index, 3));
		this.txtNamXuatBan.setText(String.valueOf(model.getValueAt(index, 4)));
		this.txtSoTrang.setText(String.valueOf(model.getValueAt(index, 5)));
		this.txtDonGia.setText(String.valueOf(model.getValueAt(index, 6)));
		this.txtISBN.setText((String) model.getValueAt(index, 7));
		
		

	}

	@Override
	public void mousePressed(MouseEvent e) {

	}

	@Override
	public void mouseReleased(MouseEvent e) {

	}

	@Override
	public void mouseEntered(MouseEvent e) {

	}

	@Override
	public void mouseExited(MouseEvent e) {

	}
	private void locTheoMaSach() {
        String selectedMaSach = (String) comboBoxMaSach.getSelectedItem();
        if (selectedMaSach != null) {
            for (Sach s : listSach) {
                if (s.getMaSach().equals(selectedMaSach)) {
                    model.setRowCount(0);
                    model.addRow(new Object[]{s.getMaSach(), s.getTuaSach(), s.getTacGia(), s.getNhaXuatBan(), s.getNamXuatBan(), s.getSoTrang(), s.getDonGia(), s.getIsbn()});
                    
                    
                    break;
                }
            }
        }
    }
}
